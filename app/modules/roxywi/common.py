import os
import glob
from typing import Any

from flask import request, g
from flask_jwt_extended import get_jwt
from flask_jwt_extended import verify_jwt_in_request

from app.modules.db.sql import get_setting
import app.modules.db.roxy as roxy_sql
import app.modules.db.user as user_sql
import app.modules.db.group as group_sql
import app.modules.db.server as server_sql
import app.modules.db.history as history_sql
import app.modules.roxy_wi_tools as roxy_wi_tools

get_config_var = roxy_wi_tools.GetConfigVar()


def get_user_group(**kwargs) -> int:
	user_group = ''

	try:
		verify_jwt_in_request()
		claims = get_jwt()
		user_group_id = claims['group']
		groups = group_sql.select_groups(id=user_group_id)
		for g in groups:
			if g.group_id == int(user_group_id):
				if kwargs.get('id'):
					user_group = g.group_id
				else:
					user_group = g.name
	except Exception as e:
		raise Exception(f'error: {e}')
	return user_group


def check_user_group_for_flask():
	verify_jwt_in_request()
	claims = get_jwt()
	user_uuid = claims['uuid']
	group_id = claims['group']
	user_id = user_sql.get_user_id_by_uuid(user_uuid)

	if user_sql.check_user_group(user_id, group_id):
		return True
	else:
		logging('RMON server', ' has tried to actions in not his group ', login=1)
		return False


def check_is_server_in_group(server_ip: str) -> bool:
	group_id = get_user_group(id=1)
	servers = server_sql.select_servers(server=server_ip)
	for s in servers:
		if (s[2] == server_ip and int(s[3]) == int(group_id)) or group_id == 1:
			return True
		else:
			logging('RMON server', ' has tried to actions in not his group server ', login=1)
			return False


def get_files(folder, file_format, server_ip=None) -> list:
	if file_format == 'log':
		file = []
	else:
		file = set()
	return_files = set()
	i = 0
	for files in sorted(glob.glob(os.path.join(folder, f'*.{file_format}*'))):
		if file_format == 'log':
			try:
				file += [(i, files.split('/')[4])]
			except Exception as e:
				print(e)
		else:
			file.add(files.split('/')[-1])
		i += 1
	files = file
	if file_format == 'cfg' or file_format == 'conf':
		for file in files:
			ip = file.split("-")
			if server_ip == ip[0]:
				return_files.add(file)
		return sorted(return_files, reverse=True)
	else:
		return file


def logging(server_ip: str, action: str, **kwargs) -> None:
	get_date = roxy_wi_tools.GetDate(get_setting('time_zone'))
	cur_date_in_log = get_date.return_date('date_in_log')
	log_path = get_config_var.get_config_var('main', 'log_path')

	if not os.path.exists(log_path):
		os.makedirs(log_path)

	try:
		user_group = get_user_group()
	except Exception:
		user_group = ''

	try:
		ip = request.remote_addr
	except Exception:
		ip = ''

	try:
		verify_jwt_in_request()
		claims = get_jwt()
		user_uuid = claims['uuid']
		login = user_sql.get_user_name_by_uuid(user_uuid)
	except Exception:
		login = ''

	if kwargs.get('login'):
		mess = f"{cur_date_in_log} from {ip} user: {login}, group: {user_group}, {action} on: {server_ip}\n"
	else:
		mess = f"{cur_date_in_log} {action} from {ip}\n"
	log_file = f"{log_path}/rmon.log"

	if kwargs.get('keep_history'):
		try:
			keep_action_history(kwargs.get('service'), action, server_ip, login, ip)
		except Exception as e:
			print(f'error: Cannot save history: {e}')

	try:
		with open(log_file, 'a') as log:
			log.write(mess)
	except IOError as e:
		print(f'Cannot write log. Please check log_path in config {e}')


def keep_action_history(service: str, action: str, server_ip: str, login: str, user_ip: str):
	if login != '':
		user = user_sql.get_user_by_username(login)
		user_id = user.user_id
	else:
		user_id = 0
	if user_ip == '':
		user_ip = 'localhost'

	try:
		server_id = server_sql.select_server_id_by_ip(server_ip=server_ip)
		hostname = server_sql.get_hostname_by_server_ip(server_ip)

		history_sql.insert_action_history(service, action, server_id, user_id, user_ip, server_ip, hostname)
	except Exception as e:
		logging('RMON server', f'Cannot save a history: {e}', roxywi=1)


def get_dick_permit(**kwargs):
	if not kwargs.get('group_id'):
		try:
			group_id = get_user_group(id=1)
		except Exception as e:
			return str(e)
	else:
		group_id = kwargs.pop('group_id')

	if check_user_group_for_flask():
		try:
			servers = server_sql.get_dick_permit(group_id, **kwargs)
		except Exception as e:
			raise Exception(e)
		else:
			return servers
	else:
		print('Atata!')


def get_users_params(**kwargs):
	verify_jwt_in_request()
	user_data = get_jwt()

	try:
		user_uuid = user_data['uuid']
		user = user_sql.get_user_name_by_uuid(user_uuid)
	except Exception:
		raise Exception('error: Cannot get user UUID')

	try:
		group_id = user_sql.get_user_current_group_by_uuid(user_uuid)
	except Exception as e:
		raise Exception(f'error: Cannot get user group: {e}')

	try:
		group_id_from_cookies = int(user_data['group'])
	except Exception as e:
		raise Exception(f'error: Cannot get group id from cookies: {e}')

	if group_id_from_cookies != group_id:
		raise Exception('error: Wrong current group')

	try:
		role = user_sql.get_user_role_by_uuid(user_uuid, group_id)
	except Exception:
		raise Exception('error: Cannot get user role')

	try:
		user_id = user_sql.get_user_id_by_uuid(user_uuid)
	except Exception as e:
		raise Exception(f'error: Cannot get user id {e}')

	try:
		user_services = user_sql.select_user_services(user_id)
	except Exception as e:
		raise Exception(f'error: Cannot get user services {e}')

	if kwargs.get('disable'):
		servers = get_dick_permit(disable=0)
	else:
		servers = get_dick_permit()

	user_lang = get_user_lang_for_flask()

	user_params = {
		'user': user,
		'user_uuid': user_uuid,
		'role': role,
		'servers': servers,
		'user_services': user_services,
		'lang': user_lang,
		'user_id': user_id,
		'group_id': group_id
	}

	return user_params


def get_user_lang_for_flask() -> str:
	try:
		user_lang = request.cookies.get('lang')
	except Exception:
		return 'en'

	if user_lang is None:
		user_lang = 'en'

	return user_lang


def return_user_status() -> dict:
	user_subscription = {}
	user_subscription.setdefault('user_status', roxy_sql.select_user_status())
	user_subscription.setdefault('user_plan', roxy_sql.select_user_plan())

	return user_subscription


def return_unsubscribed_user_status() -> dict:
	user_subscription = {'user_status': 0, 'user_plan': 0}

	return user_subscription


def return_user_subscription():
	try:
		user_subscription = return_user_status()
	except Exception as e:
		user_subscription = return_unsubscribed_user_status()
		logging('RMON server', f'Cannot get a user plan: {e}', roxywi=1)

	return user_subscription


def handle_exceptions(ex: Exception, server_ip: str, message: str, **kwargs: Any) -> None:
	"""
	:param server_ip:
	:param ex: The exception that was caught
	:param message: The error message to be logged and raised
	:param kwargs: Additional keyword arguments to be passed to the logging function
	:return: None

	"""
	logging(server_ip, f'error: {message}: {ex}', **kwargs)
	raise Exception(f'error: {message}: {ex}')


def handle_json_exceptions(ex: Exception, message: str, server_ip='RMON server') -> dict:
	logging(server_ip, f'error: {message}: {ex}', login=1)
	return {'status': 'failed', 'error': f'{message}: {ex}'}


def is_user_has_access_to_group(user_id: int) -> None:
	if not user_sql.check_user_group(user_id, g.user_params['group_id']) and g.user_params['role'] != 1:
		raise Exception('User has no access to group')
