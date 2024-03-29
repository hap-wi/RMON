var awesome = "/static/js/fontawesome.min.js"
var cur_url = window.location.href.split('/').pop();
cur_url = cur_url.split('/');
var add_word = $('#translate').attr('data-add');
var delete_word = $('#translate').attr('data-delete');
var cancel_word = $('#translate').attr('data-cancel');
$( function() {
	$('#add-group-button').click(function() {
		addGroupDialog.dialog('open');
	});
	var group_tabel_title = $( "#group-add-table-overview" ).attr('title');
	var addGroupDialog = $( "#group-add-table" ).dialog({
		autoOpen: false,
		resizable: false,
		height: "auto",
		width: 600,
		modal: true,
		title: group_tabel_title,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		},
		buttons: {
			"Add": function() {
				addGroup(this);
			},
			Cancel: function() {
				$( this ).dialog( "close" );
				clearTips();
			}
		}
	});
	$('#add-user-button').click(function() {
		addUserDialog.dialog('open');
	});
	var user_tabel_title = $( "#user-add-table-overview" ).attr('title');
	var addUserDialog = $( "#user-add-table" ).dialog({
		autoOpen: false,
		resizable: false,
		height: "auto",
		width: 600,
		modal: true,
		title: user_tabel_title,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		},
		buttons: [{
			text: add_word,
			click: function () {
				addUser(this);
			}
		}, {
			text: cancel_word,
			click: function () {
				$(this).dialog("close");
				clearTips();
			}
		}]
	});
	$('#add-server-button').click(function() {
		addServerDialog.dialog('open');
	});
	var server_tabel_title = $( "#server-add-table-overview" ).attr('title');
	var addServerDialog = $( "#server-add-table" ).dialog({
		autoOpen: false,
		resizable: false,
		height: "auto",
		width: 600,
		modal: true,
		title: server_tabel_title,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		},
		buttons: [{
			text: add_word,
			click: function () {
				addServer(this);
			}
		}, {
			text: cancel_word,
			click: function () {
				$(this).dialog("close");
				clearTips();
			}
		}]
	});
	$('#add-ssh-button').click(function() {
		addCredsDialog.dialog('open');
	});
	var ssh_tabel_title = $( "#ssh-add-table-overview" ).attr('title');
	var addCredsDialog = $( "#ssh-add-table" ).dialog({
		autoOpen: false,
		resizable: false,
		height: "auto",
		width: 600,
		modal: true,
		title: ssh_tabel_title,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		},
		buttons: [{
			text: add_word,
			click: function () {
				addCreds(this);
			}
		}, {
			text: cancel_word,
			click: function () {
				$(this).dialog("close");
				clearTips();
			}
		}]
	});
	$( "#ajax-users input" ).change(function() {
		var id = $(this).attr('id').split('-');
		updateUser(id[1])
	});
	$( "#ajax-users select" ).on('selectmenuchange',function() {
		var id = $(this).attr('id').split('-');
		updateUser(id[1])
	});
	$( "#ajax-group input" ).change(function() {
		var id = $(this).attr('id').split('-');
		updateGroup(id[1])
	});
	$( "#ajax-servers input" ).change(function() {
		var id = $(this).attr('id').split('-');
		updateServer(id[1])
	});
	$( "#ajax-servers select" ).on('selectmenuchange',function() {
		var id = $(this).attr('id').split('-');
		updateServer(id[1])
	});
	$( "#ssh_enable_table input" ).change(function() {
		var id = $(this).attr('id').split('-');
		updateSSH(id[1])
		sshKeyEnableShow(id[1])
	});
	$( "#ssh_enable_table select" ).on('selectmenuchange',function() {
		var id = $(this).attr('id').split('-');
		updateSSH(id[1])
		sshKeyEnableShow(id[1])
	});
	$('#new-ssh_enable').click(function() {
		if ($('#new-ssh_enable').is(':checked')) {
			$('#ssh_pass').css('display', 'none');
		} else {
			$('#ssh_pass').css('display', 'block');
		}
	});
	if ($('#new-ssh_enable').is(':checked')) {
		$('#ssh_pass').css('display', 'none');
	} else {
		$('#ssh_pass').css('display', 'block');
	}
	$('#search_ldap_user').click(function() {
		var valid = true;
		toastr.clear();
		allFields = $([]).add($('#new-username'));
		allFields.removeClass("ui-state-error");
		valid = valid && checkLength($('#new-username'), "user name", 1);
		user = $('#new-username').val()
		if (valid) {
			$.ajax({
				url: "/user/ldap/" + $('#new-username').val(),
				// data: {
				// 	token: $('#token').val()
				// },
				// type: "POST",
				success: function (data) {
					data = data.replace(/\s+/g, ' ');
					if (data.indexOf('error:') != '-1') {
						toastr.error(data);
						$('#new-email').val('');
						$('#new-password').attr('readonly', false);
						$('#new-password').val('');
					} else {
						var json = $.parseJSON(data);
						toastr.clear();
						if (!$('#new-username').val().includes('@')) {
							$('#new-username').val(user + '@' + json[1]);
						}
						$('#new-email').val(json[0]);
						$('#new-password').val('aduser');
						$('#new-password').attr('readonly', true);
					}
				}
			});
			clearTips();
		}
	});
	$("#tabs ul li").click(function() {
		var activeTab = $(this).find("a").attr("href");
		var activeTabClass = activeTab.replace('#', '');
		$('.menu li ul li').each(function () {
			$(this).find('a').css('border-left', '0px solid var(--right-menu-blue-color)');
			$(this).find('a').css('padding-left', '20px')
			$(this).find('a').css('background-color', '#48505A');
			$(this).children("."+activeTabClass).css('padding-left', '30px');
			$(this).children("."+activeTabClass).css('border-left', '4px solid var(--right-menu-blue-color)');
			$(this).children("."+activeTabClass).css('background-color', 'var(--right-menu-blue-color)');
		});
		if (activeTab == '#tools') {
			loadServices();
		} else if (activeTab == '#updatehapwi') {
			loadupdatehapwi();
		}
	});
} );
window.onload = function() {
	$('#tabs').tabs();
	var activeTabIdx = $('#tabs').tabs('option','active')
	if (cur_url[0].split('#')[0] == 'admin') {
		if (activeTabIdx == 5) {
			loadServices();
		} else if (activeTabIdx == 6) {
			loadupdatehapwi();
		}
	}
}
function addUser(dialog_id) {
	var valid = true;
	toastr.clear();
	allFields = $([]).add($('#new-username')).add($('#new-password')).add($('#new-email'))
	allFields.removeClass("ui-state-error");
	valid = valid && checkLength($('#new-username'), "user name", 1);
	valid = valid && checkLength($('#new-password'), "password", 1);
	valid = valid && checkLength($('#new-email'), "Email", 1);
	var activeuser = 0;
	if ($('#activeuser').is(':checked')) {
		activeuser = '1';
	}
	if (valid) {
		$.ajax({
			url: "/user/create",
			data: {
				newusername: $('#new-username').val(),
				newpassword: $('#new-password').val(),
				newemail: $('#new-email').val(),
				newrole: $('#new-role').val(),
				activeuser: activeuser,
				page: cur_url[0].split('#')[0],
				newgroupuser: $('#new-group').val(),
				token: $('#token').val()
			},
			type: "POST",
			success: function (data) {
				data = data.replace(/\s+/g, ' ');
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else {
					var getId = new RegExp('[0-9]+');
					var id = data.match(getId);
					common_ajax_action_after_success(dialog_id, 'user-' + id, 'ajax-users', data);
				}
			}
		});
	}
}
function addGroup(dialog_id) {
	toastr.clear();
	var valid = true;
	allFields = $([]).add($('#new-group-add'));
	allFields.removeClass("ui-state-error");
	valid = valid && checkLength($('#new-group-add'), "new group name", 1);
	if (valid) {
		$.ajax({
			url: "/server/group/create",
			data: {
				groupname: $('#new-group-add').val(),
				newdesc: $('#new-desc').val(),
				token: $('#token').val()
			},
			type: "POST",
			success: function (data) {
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else {
					var getId = new RegExp('[0-9]+');
					var id = data.match(getId);
					$('select:regex(id, group)').append('<option value=' + id + '>' + $('#new-group-add').val() + '</option>').selectmenu("refresh");
					common_ajax_action_after_success(dialog_id, 'newgroup', 'ajax-group', data);
				}
			}
		});
	}
}
function addServer(dialog_id) {
	toastr.clear()
	var valid = true;
	var servername = $('#new-server-add').val();
	var newip = $('#new-ip').val();
	var newservergroup = $('#new-server-group-add').val();
	var cred = $('#credentials').val();
	var enable = 0;
	var firewall = 0;
	var add_to_smon = 0;
	if ($('#enable').is(':checked')) {
		enable = '1';
	}
	if ($('#firewall').is(':checked')) {
		firewall = '1';
	}
	if ($('#add_to_smon').is(':checked')) {
		add_to_smon = '1';
	}
	allFields = $([]).add($('#new-server-add')).add($('#new-ip')).add($('#new-port'))
	allFields.removeClass("ui-state-error");
	valid = valid && checkLength($('#new-server-add'), "Hostname", 1);
	valid = valid && checkLength($('#new-ip'), "IP", 1);
	valid = valid && checkLength($('#new-port'), "Port", 1);
	if (cred == null) {
		toastr.error('First select credentials');
		return false;
	}
	if (newservergroup == null) {
		toastr.error('First select a group');
		return false;
	}
	if (valid) {
		$.ajax({
			url: "/server/create",
			data: {
				servername: servername,
				newip: newip,
				newport: $('#new-port').val(),
				newservergroup: newservergroup,
				firewall: firewall,
				add_to_smon: add_to_smon,
				enable: enable,
				cred: cred,
				page: cur_url[0].split('#')[0],
				desc: $('#desc').val(),
				token: $('#token').val()
			},
			type: "POST",
			success: function (data) {
				data = data.replace(/\s+/g, ' ');
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else {
					common_ajax_action_after_success(dialog_id, 'newserver', 'ajax-servers', data);
					$("input[type=submit], button").button();
					$("input[type=checkbox]").checkboxradio();
					$(".controlgroup").controlgroup();
					$("select").selectmenu();
					var getId = new RegExp('server-[0-9]+');
					var id = data.match(getId) + '';
					after_server_creating(servername, newip);
				}
			}
		});
	}
}
function after_server_creating(servername, newip) {
	$.ajax({
		url: "/server/create/after",
		data: {
			act: 'after_adding',
			servername: servername,
			newip: newip,
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('You should install lshw on the server') != '-1') {
				toastr.error(data);
			} else if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			}
		}
	});
}
function addCreds(dialog_id) {
	toastr.clear();
	var ssh_enable = 0;
	if ($('#new-ssh_enable').is(':checked')) {
		ssh_enable = '1';
	}
	var valid = true;
	allFields = $([]).add($('#new-ssh-add')).add($('#ssh_user'))
	allFields.removeClass("ui-state-error");
	valid = valid && checkLength($('#new-ssh-add'), "Name", 1);
	valid = valid && checkLength($('#ssh_user'), "Credentials", 1);
	if (valid) {
		$.ajax({
			url: "/server/ssh/create",
			data: {
				new_ssh: $('#new-ssh-add').val(),
				new_group: $('#new-sshgroup').val(),
				ssh_user: $('#ssh_user').val(),
				ssh_pass: $('#ssh_pass').val(),
				ssh_enable: ssh_enable,
				page: cur_url[0].split('#')[0],
				token: $('#token').val()
			},
			type: "POST",
			success: function (data) {
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else {
					var group_name = getGroupNameById($('#new-sshgroup').val());
					var getId = new RegExp('ssh-table-[0-9]+');
					var id = data.match(getId) + '';
					id = id.split('-').pop();
					common_ajax_action_after_success(dialog_id, 'ssh-table-' + id, 'ssh_enable_table', data);
					$('select:regex(id, credentials)').append('<option value=' + id + '>' + $('#new-ssh-add').val() + '</option>').selectmenu("refresh");
					$('select:regex(id, ssh-key-name)').append('<option value=' + $('#new-ssh-add').val() + '_' + group_name + '>' + $('#new-ssh-add').val() + '_' + group_name + '</option>').selectmenu("refresh");
					$("input[type=submit], button").button();
					$("input[type=checkbox]").checkboxradio();
					$("select").selectmenu();
				}
			}
		});
	}
}
function getGroupNameById(group_id) {
	var group_name = ''
	$.ajax({
		url: "/user/group/name/" + group_id,
		async: false,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				group_name = data;
			}
		}
	});
	return group_name;
}
function sshKeyEnableShow(id) {
	$('#ssh_enable-'+id).click(function() {
		if ($('#ssh_enable-'+id).is(':checked')) {
			$('#ssh_pass-'+id).css('display', 'none');
		} else {
			$('#ssh_pass-'+id).css('display', 'block');
		}
	});
	if ($('#ssh_enable-'+id).is(':checked')) {
		$('#ssh_pass-'+id).css('display', 'none');
	} else {
		$('#ssh_pass-'+id).css('display', 'block');
	}
}

function confirmDeleteUser(id) {
	 $( "#dialog-confirm" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
	  title: delete_word + " " +$('#login-'+id).val() + "?",
      buttons: [{
		  text: delete_word,
		  click: function () {
			  $(this).dialog("close");
			  removeUser(id);
		  }
	  }, {
		  text: cancel_word,
		  click: function () {
			  $(this).dialog("close");
		  }
	  }]
    });
}
function confirmDeleteGroup(id) {
	 $( "#dialog-confirm" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
	  title: delete_word+ " " +$('#name-'+id).val() + "?",
      buttons:  [{
		  text: delete_word,
		  click: function() {
			  $(this).dialog("close");
			  removeGroup(id);
		  }
        }, {
		  text: cancel_word,
		  click: function () {
			  $(this).dialog("close");
		  }
	  }]
    });
}
function confirmDeleteServer(id) {
	$( "#dialog-confirm" ).dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		title: delete_word + " " + $('#hostname-' + id).val() + "?",
		buttons: [{
			text: delete_word,
			click: function () {
				$(this).dialog("close");
				removeServer(id);
			}
		},{
			text: cancel_word,
			click: function () {
				$(this).dialog("close");
			}
		}]
	});
}
function confirmDeleteSsh(id) {
	$( "#dialog-confirm" ).dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		title: delete_word +" " + $('#ssh_name-' + id).val() + "?",
		buttons: [{
			text: delete_word,
			click: function () {
				$(this).dialog("close");
				removeSsh(id);
			}
		},{
			text: cancel_word,
			click: function () {
				$(this).dialog("close");
			}
		}]
	});
}
function cloneServer(id) {
	$( "#add-server-button" ).trigger( "click" );
	if ($('#enable-'+id).is(':checked')) {
		$('#enable').prop('checked', true)
	} else {
		$('#enable').prop('checked', false)
	}
	$('#enable').checkboxradio("refresh");
	$('#new-server-add').val($('#hostname-'+id).val())
	$('#new-ip').val($('#ip-'+id).val())
	$('#new-port').val($('#port-'+id).val())
	$('#desc').val($('#desc-'+id).val())
	$('#credentials').val($('#credentials-'+id+' option:selected').val()).change()
	$('#credentials').selectmenu("refresh");
	if (cur_url[0].indexOf('admin') != '-1') {
		$('#new-server-group-add').val($('#servergroup-'+id+' option:selected').val()).change()
		$('#new-server-group-add').selectmenu("refresh");
	}
}
function removeUser(id) {
	$("#user-" + id).css("background-color", "#f2dede");
	$.ajax({
		url: "/user/delete/" + id,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data == "ok") {
				$("#user-" + id).remove();
			} else if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			}
		}
	});
}
function removeServer(id) {
	$("#server-" + id).css("background-color", "#f2dede");
	$.ajax({
		url: "/server/delete/" + id,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data == "Ok") {
				$("#server-" + id).remove();
			} else if (data.indexOf('error: ') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			} else if (data.indexOf('warning: ') != '-1') {
				toastr.clear();
				toastr.warning(data);
			}
		}
	});
}
function removeGroup(id) {
	$("#group-" + id).css("background-color", "#f2dede");
	$.ajax({
		url: "/server/group/delete/" + id,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data == "ok") {
				$("#group-" + id).remove();
				$('select:regex(id, group) option[value=' + id + ']').remove();
				$('select:regex(id, group)').selectmenu("refresh");
			} else if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			}
		}
	});
}
function removeSsh(id) {
	$("#ssh-table-"+id).css("background-color", "#f2dede");
	$.ajax( {
		url: "/server/ssh/delete/" + id,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if(data == "ok") {
				$("#ssh-table-"+id).remove();
				$('select:regex(id, credentials) option[value='+id+']').remove();
				$('select:regex(id, credentials)').selectmenu("refresh");
			} else if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			}
		}
	} );
}
function updateUser(id) {
	toastr.remove();
	cur_url[0] = cur_url[0].split('#')[0]
	var usergroup = Cookies.get('group');
	var role = $('#role-' + id).val();
	var activeuser = 0;
	if ($('#activeuser-' + id).is(':checked')) {
		activeuser = '1';
	}
	if (role == null && role !== undefined) {
		toastr.warning('Please edit this user only on the Admin area');
		return false;
	}
	toastr.remove();
	$.ajax({
		url: "/user/update",
		data: {
			updateuser: $('#login-' + id).val(),
			email: $('#email-' + id).val(),
			role: role,
			usergroup: usergroup,
			activeuser: activeuser,
			id: id,
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			} else {
				toastr.remove();
				$("#user-" + id).addClass("update", 1000);
				setTimeout(function () {
					$("#user-" + id).removeClass("update");
				}, 2500);
			}
		}
	});
}
function updateGroup(id) {
	toastr.clear();
	$.ajax({
		url: "/server/group/update",
		data: {
			updategroup: $('#name-' + id).val(),
			descript: $('#descript-' + id).val(),
			id: id,
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			} else {
				toastr.clear();
				$("#group-" + id).addClass("update", 1000);
				setTimeout(function () {
					$("#group-" + id).removeClass("update");
				}, 2500);
				$('select:regex(id, group) option[value=' + id + ']').remove();
				$('select:regex(id, group)').append('<option value=' + id + '>' + $('#name-' + id).val() + '</option>').selectmenu("refresh");
			}
		}
	});
}
function updateServer(id) {
	toastr.clear();
	let enable = 0;
	if ($('#enable-' + id).is(':checked')) {
		enable = '1';
	}
	if ($('#firewall-' + id).is(':checked')) {
		firewall = '1';
	}
	var servergroup = $('#servergroup-' + id + ' option:selected').val();
	if (cur_url[0].indexOf('servers#') != '-1') {
		servergroup = $('#new-server-group-add').val();
	}
	$.ajax({
		url: "/server/update",
		data: {
			updateserver: $('#hostname-' + id).val(),
			port: $('#port-' + id).val(),
			servergroup: servergroup,
			enable: enable,
			cred: $('#credentials-' + id + ' option:selected').val(),
			id: id,
			desc: $('#desc-' + id).val(),
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			} else {
				toastr.clear();
				$("#server-" + id).addClass("update", 1000);
				setTimeout(function () {
					$("#server-" + id).removeClass("update");
				}, 2500);
			}
		}
	});
}
function uploadSsh() {
	toastr.clear();
	if ($("#ssh-key-name option:selected").val() == "------" || $('#ssh_cert').val() == '') {
		toastr.error('All fields must be completed');
	} else {
		$.ajax({
			url: "/server/ssh/upload",
			data: {
				ssh_cert: $('#ssh_cert').val(),
				name: $('#ssh-key-name').val(),
				pass: $('#ssh-key-pass').val(),
				token: $('#token').val()
			},
			type: "POST",
			success: function (data) {
				data = data.replace(/\s+/g, ' ');
				if (data.indexOf('danger') != '-1' || data.indexOf('unique') != '-1' || data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else if (data.indexOf('success') != '-1') {
					toastr.clear();
					toastr.success(data)
				} else {
					toastr.error('Something wrong, check and try again');
				}
			}
		});
	}
}
function updateSSH(id) {
	toastr.clear();
	var ssh_enable = 0;
	if ($('#ssh_enable-' + id).is(':checked')) {
		ssh_enable = '1';
	}
	var group = $('#sshgroup-' + id).val();
	if (cur_url[0].indexOf('servers') != '-1') {
		group = $('#new-server-group-add').val();
	}
	$.ajax({
		url: "/server/ssh/update",
		data: {
			name: $('#ssh_name-' + id).val(),
			group: group,
			ssh_enable: ssh_enable,
			ssh_user: $('#ssh_user-' + id).val(),
			ssh_pass: $('#ssh_pass-' + id).val(),
			id: id,
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1' || data.indexOf('unique') != '-1') {
				toastr.error(data);
			} else {
				toastr.clear();
				$("#ssh-table-" + id).addClass("update", 1000);
				setTimeout(function () {
					$("#ssh-table-" + id).removeClass("update");
				}, 2500);
				$('select:regex(id, credentials) option[value=' + id + ']').remove();
				$('select:regex(id, ssh-key-name) option[value=' + $('#ssh_name-' + id).val() + ']').remove();
				$('select:regex(id, credentials)').append('<option value=' + id + '>' + $('#ssh_name-' + id).val() + '</option>').selectmenu("refresh");
				$('select:regex(id, ssh-key-name)').append('<option value=' + $('#ssh_name-' + id).val() + '>' + $('#ssh_name-' + id).val() + '</option>').selectmenu("refresh");
			}
		}
	});
}
function showApacheLog(serv) {
	var rows = $('#rows').val();
	var grep = $('#grep').val();
	var exgrep = $('#exgrep').val();
	var hour = $('#time_range_out_hour').val();
	var minute = $('#time_range_out_minut').val();
	var hour1 = $('#time_range_out_hour1').val();
	var minute1 = $('#time_range_out_minut1').val();
	var url = "/logs/apache_internal/" + serv + "/" + rows;
	$.ajax( {
		url: url,
		data: {
			rows: rows,
			serv: serv,
			grep: grep,
			exgrep: exgrep,
			hour: hour,
			minute: minute,
			hour1: hour1,
			minute1: minute1,
			token: $('#token').val()
		},
		type: "POST",
		success: function( data ) {
			$("#ajax").html(data);
		}
	} );
}
function checkSshConnect(ip) {
	$.ajax({
		url: "/server/check/ssh/" + ip,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data)
			} else if (data.indexOf('failed') != '-1') {
				toastr.error(data)
			} else if (data.indexOf('Errno') != '-1') {
				toastr.error(data)
			} else {
				toastr.clear();
				toastr.success('Connect is accepted');
			}
		}
	});
}
function openChangeUserPasswordDialog(id) {
	changeUserPasswordDialog(id);
}
function changeUserPasswordDialog(id) {
	var cancel_word = $('#translate').attr('data-cancel');
	var superAdmin_pass = $('#translate').attr('data-superAdmin_pass');
	var change_word = $('#translate').attr('data-change2');
	var password_word = $('#translate').attr('data-password');
	if ($('#role-'+id + ' option:selected' ).val() == 'Select a role') {
		toastr.warning(superAdmin_pass);
		return false;
	}
	$( "#user-change-password-table" ).dialog({
		autoOpen: true,
		resizable: false,
		height: "auto",
		width: 600,
		modal: true,
		title: change_word + " " + $('#login-' + id).val() + " " + password_word,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		},
		buttons: [{
			text: change_word,
			click: function () {
				changeUserPassword(id, $(this));
			}
		}, {
			text: cancel_word,
			click: function () {
				$(this).dialog("close");
				$('#missmatchpass').hide();
			}
		}]
	});
}
function changeUserPassword(id, d) {
	var pass = $('#change-password').val();
	var pass2 = $('#change2-password').val();
	if (pass != pass2) {
		$('#missmatchpass').show();
	} else {
		$('#missmatchpass').hide();
		toastr.clear();
		$.ajax({
			url: "/user/password",
			data: {
				updatepassowrd: pass,
				id: id,
				token: $('#token').val()
			},
			type: "POST",
			success: function (data) {
				data = data.replace(/\s+/g, ' ');
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else {
					toastr.clear();
					$("#user-" + id).addClass("update", 1000);
					setTimeout(function () {
						$("#user-" + id).removeClass("update");
					}, 2500);
					d.dialog("close");
				}
			}
		});
	}
}
function confirmAjaxServiceAction(action, service) {
	let cancel_word = $('#translate').attr('data-cancel');
	let action_word = $('#translate').attr('data-'+action);
	$( "#dialog-confirm-services" ).dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		title: action_word + " " + service+"?",
		buttons: [{
			text: action_word,
			click: function () {
				$(this).dialog("close");
				ajaxActionServices(action, service);
			}
		}, {
			text: cancel_word,
			click: function() {
				$( this ).dialog( "close" );
			}
		}]
	});
}
function ajaxActionServices(action, service) {
	$.ajax( {
		url: "/admin/tools/action/" + service + "/" + action,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function( data ) {
			if (data.indexOf('error:') != '-1' || data.indexOf('Failed') != '-1') {
				toastr.error(data);
			} else if (data.indexOf('warning: ') != '-1') {
				toastr.warning(data);
			} else {
				window.history.pushState("services", "services", cur_url[0].split("#")[0] + "#tools");
				toastr.success('The ' + service + ' has been ' + action +'ed');
				loadServices();
			}
		},
		error: function(){
			alert(w.data_error);
		}
	} );
}
function updateService(service, action='update') {
	$("#ajax-update").html('')
	$("#ajax-update").html(wait_mess);
	$.ajax({
		url: "/admin/tools/update/" + service,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('Complete!') != '-1' || data.indexOf('Unpacking') != '-1') {
				toastr.clear();
				toastr.success(service + ' has been ' + action + 'ed');
			} else if (data.indexOf('Unauthorized') != '-1' || data.indexOf('Status code: 401') != '-1') {
				toastr.clear();
				toastr.error('It looks like there is no authorization in the RMON repository. Your subscription may have expired or there is no subscription. How to get the <b><a href="https://roxy-wi.org/pricing" title="Pricing" target="_blank">subscription</a></b>');
			} else if (data.indexOf('but not installed') != '-1') {
				toastr.clear();
				toastr.error('There is setting for RMON repository, but RMON is installed without repository. Please reinstall with package manager');
			} else if (data.indexOf('No Match for argument') != '-1' || data.indexOf('Unable to find a match') != '-1') {
				toastr.clear();
				toastr.error('It seems like RMON repository is not set. Please read docs for <b><a href="https://rmon.io/updates">detail</a></b>');
			} else if (data.indexOf('password for') != '-1') {
				toastr.clear();
				toastr.error('It seems like apache user needs to be added to sudoers. Please read docs for <b><a href="https://roxy-wi.org/installation#ansible">detail</a></b>');
			} else if (data.indexOf('No packages marked for update') != '-1') {
				toastr.clear();
				toastr.info('It seems like the latest version RMON is installed');
			} else if (data.indexOf('Connection timed out') != '-1') {
				toastr.clear();
				toastr.error('Cannot connect to RMON repository. Connection timed out');
			} else if (data.indexOf('--disable') != '-1') {
				toastr.clear();
				toastr.error('It seems like there is a problem with repositories');
			} else if (data.indexOf('Error: Package') != '-1') {
				toastr.clear();
				toastr.error(data);
			} else if (data.indexOf('conflicts with file from') != '-1') {
				toastr.clear();
				toastr.error(data);
			} else if (data.indexOf('error:') != '-1' || data.indexOf('Failed') != '-1') {
				toastr.error(data);
			} else if (data.indexOf('0 upgraded, 0 newly installed') != '-1') {
				toastr.info('There is no a new version of ' + service);
			} else {
				toastr.clear();
				toastr.success(service + ' has been ' + action + 'ed');
			}
			$("#ajax-update").html('');
			loadupdatehapwi();
			loadServices();
			show_version();
		}
	});
}
function viewFirewallRules(ip) {
	$.ajax({
		url: "/server/firewall/" + ip,
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('danger') != '-1' || data.indexOf('unique') != '-1' || data.indexOf('error: ') != '-1') {
				toastr.error(data);
			} else {
				toastr.clear();
				$("#firewall_rules_body").html(data);
				$("#firewall_rules" ).dialog({
					resizable: false,
					height: "auto",
					width: 860,
					modal: true,
					title: "Firewall rules",
					buttons: {
						Close: function() {
							$( this ).dialog( "close" );
							$("#firewall_rules_body").html('');
						}
					}
				});
			}
		}
	} );
}
function loadServices() {
	$.ajax({
		url: "/admin/tools",
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('danger') != '-1' || data.indexOf('unique') != '-1' || data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$('#ajax-services-body').html(data);
				$.getScript(awesome);
			}
		}
	} );
}
function loadupdatehapwi() {
	$.ajax({
		url: "/admin/update",
		// data: {
		// 	token: $('#token').val()
		// },
		// type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('danger') != '-1' || data.indexOf('unique') != '-1' || data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$('#ajax-updatehapwi-body').html(data);
			}
		}
	} );
}
function checkUpdateRoxy() {
	$.ajax({
		url: "/admin/update/check",
		success: function (data) {
			loadupdatehapwi();
		}
	} );
}
function updateServerInfo(ip, id) {
	$.ajax({
		url: "/server/system_info/update/" + ip + "/" + id,
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1' || data.indexOf('error_code') != '-1') {
				toastr.error(data);
			} else {
				$("#server_info-" + id).html(data);
				$('#server_info-' + id).show();
				$('#server_info_link-' + id).attr('title', 'Hide System info');
				$.getScript(awesome);
			}
		}
	});
}
function showServerInfo(id, ip) {
	var close_word = $('#translate').attr('data-close');
	var server_info = $('#translate').attr('data-server_info');
	$.ajax({
		url: "/server/system_info/get/" + ip + "/" +id,
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1' || data.indexOf('error_code') != '-1') {
				toastr.error(data);
			} else {
				$("#server-info").html(data);
				$("#dialog-server-info").dialog({
					resizable: false,
					height: "auto",
					width: 1000,
					modal: true,
					title: server_info + " (" + ip + ")",
					buttons: [{
						text: close_word,
						click: function () {
							$(this).dialog("close");
						}
					}]
				});
				$.getScript(awesome);
			}
		}
	});
}
function serverIsUp(server_ip, server_id) {
	var cur_url = window.location.href.split('/').pop();
	if (cur_url.split('#')[1] == 'servers') {
		$.ajax({
			url: "/server/check/server/" + server_ip,
			success: function (data) {
				data = data.replace(/^\s+|\s+$/g, '');
				if (data.indexOf('up') != '-1') {
					$('#server_status-' + server_id).removeClass('serverNone');
					$('#server_status-' + server_id).removeClass('serverDown');
					$('#server_status-' + server_id).addClass('serverUp');
					$('#server_status-' + server_id).attr('title', 'Server is reachable');
				} else if (data.indexOf('down') != '-1') {
					$('#server_status-' + server_id).removeClass('serverNone');
					$('#server_status-' + server_id).removeClass('serverUp');
					$('#server_status-' + server_id).addClass('serverDown');
					$('#server_status-' + server_id).attr('title', 'Server is unreachable');
				} else {
					$('#server_status-' + server_id).removeClass('serverDown');
					$('#server_status-' + server_id).removeClass('serverUp');
					$('#server_status-' + server_id).addClass('serverNone');
					$('#server_status-' + server_id).attr('title', 'Cannot get server status');
				}
			}
		});
	}
}
function confirmChangeGroupsAndRoles(user_id) {
	var cancel_word = $('#translate').attr('data-cancel');
	var action_word = $('#translate').attr('data-save');
	var user_groups_word = $('#translate').attr('data-user_groups');
	var username = $('#login-' + user_id).val();
	$.ajax({
		url: "/user/groups/" + user_id,
		success: function (data) {
			$("#groups-roles").html(data);
			$("#groups-roles").dialog({
				resizable: false,
				height: "auto",
				width: 700,
				modal: true,
				title: user_groups_word + ' ' + username,
				buttons: [{
					text: action_word,
					click: function () {
						saveGroupsAndRoles(user_id);
						$(this).dialog("close");
					}
				}, {
					text: cancel_word,
					click: function () {
						$(this).dialog("close");
					}
				}]
			});
		}
	});
}
function addGroupToUser(group_id) {
	var group_name = $('#add_group-'+group_id).attr('data-group_name');
	var group2_word = $('#translate').attr('data-group2');
	var length_tr = $('#all_groups tbody tr').length;
	const roles = {1: 'superAdmin', 2: 'amdin', 3: 'user', 4: 'guest'};
	var options_roles = '';
	for (const [role_id, role_name] of Object.entries(roles)) {
		options_roles += '<option value="'+role_id+'">'+role_name+'</option>';
	}
	var tr_class = 'odd';
	if (length_tr % 2 != 0) {
		tr_class = 'even';
	}
	var html_tag = '<tr class="'+tr_class+'" id="remove_group-'+group_id+'" data-group_name="'+group_name+'">\n' +
		'        <td class="padding20" style="width: 50%;">'+group_name+'</td>\n' +
		'        <td style="width: 50%;">\n' +
		'            <select id="add_role-'+group_id+'">'+options_roles+'</select></td>\n' +
		'        <td><span class="remove_user_group" onclick="removeGroupFromUser('+group_id+')" title="'+delete_word+' '+group2_word+'">-</span></td></tr>'
	$('#add_group-'+group_id).remove();
	$("#checked_groups tbody").append(html_tag);
}
function removeGroupFromUser(group_id) {
	var group_name = $('#remove_group-'+group_id).attr('data-group_name');
	var add_word = $('#translate').attr('data-add');
	var group2_word = $('#translate').attr('data-group2');
	var length_tr = $('#all_groups tbody tr').length;
	var tr_class = 'odd';
	if (length_tr % 2 != 0) {
		tr_class = 'even';
	}
	var html_tag = '<tr class="'+tr_class+'" id="add_group-'+group_id+'" data-group_name='+group_name+'>\n' +
		'    <td class="padding20" style="width: 100%">'+group_name+'</td>\n' +
		'    <td><span class="add_user_group" title="'+add_word+' '+group2_word+'" onclick="addGroupToUser('+group_id+')">+</span></td></tr>'
	$('#remove_group-'+group_id).remove();
	$("#all_groups tbody").append(html_tag);
}
function saveGroupsAndRoles(user_id) {
	var length_tr = $('#checked_groups tbody tr').length;
	var jsonData = {};
	jsonData[user_id] = {};
	$('#checked_groups tbody tr').each(function () {
		var this_id = $(this).attr('id').split('-')[1];
		var role_id = $('#add_role-' + this_id).val();
		jsonData[user_id][this_id] = {'role_id': role_id};
	});
	for (const [key, value] of Object.entries(jsonData)) {
		if (Object.keys(value).length === 0) {
			toastr.error('error: User must have at least one group');
			return false;
		}
	}
	$.ajax({
		url: "/user/groups/save",
		data: {
			changeUserGroupsUser: $('#login-' + user_id).val(),
			jsonDatas: JSON.stringify(jsonData),
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			if (data.indexOf('error: ') != '-1') {
				toastr.warning(data);
			} else {
				$("#user-" + user_id).addClass("update", 1000);
				setTimeout(function () {
					$("#user-" + user_id).removeClass("update");
				}, 2500);
			}
		}
	});
}