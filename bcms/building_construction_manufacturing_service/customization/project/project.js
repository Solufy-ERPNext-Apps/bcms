frappe.ui.form.on("Project", {
	refresh: function(frm) {
		cur_frm.remove_custom_button('Set Project Status','Actions')
		cur_frm.remove_custom_button('Duplicate Project with Tasks', 'Actions');
		cur_frm.remove_custom_button('Update Total Purchase Cost', 'Actions'); 
		cur_frm.remove_custom_button('Set Project Status', 'Actions');
		cur_frm.remove_custom_button('Gantt Chart', 'View');
		cur_frm.remove_custom_button('Kanban Board', 'View');
	}
});

frappe.ui.form.on('Project', {
	onload(frm) {
		frm.no_timeline = true; 
	},
	refresh(frm) {
		if (frm.timeline && frm.timeline.wrapper) {
			frm.timeline.wrapper.hide();
		}
		if (frm.fields_dict.__connections__) {
			frm.fields_dict.__connections__.wrapper.hide();
		}
	}
});
frappe.ui.form.on('Project', {
	refresh: function(frm) {
		frappe.after_ajax(() => {
			setTimeout(() => {
				if (frm.page.sidebar) {
					const sidebar = frm.page.sidebar;
					
					sidebar.find('.sidebar-menu a:contains("See on Website")').hide();
					sidebar.find('.form-stats-likes').hide();
					sidebar.find('.comment-icon').hide();
					sidebar.find('.ml-2').hide();
					sidebar.find('.modified-by').hide();
					sidebar.find('.mx-2').hide();
					sidebar.find('.created-by').hide();
					sidebar.find('.comments').hide();
					sidebar.find('.form-tags').hide();
					sidebar.find('.form-shared').hide();
					sidebar.find('.icon-sm').hide();
					sidebar.find('.form-follow').hide();
					frm.page.wrapper.find(".comment-box").css({'display':'none'});
					$(".form-assignments").hide()
					frm.page.wrapper.find('.scroll-to-top btn btn-default icon-btn').css({'display':'none'})
					frm.page.wrapper.find('.actions-btn-group:visible').first().css({'display':'none'});
				}   

			}, 0); 
		});
	}
});
frappe.ui.form.on('Project', {
	branch: function(frm) {
		if (frm.doc.branch) {
			frappe.db.get_doc('Branch', frm.doc.branch).then(function(doc) {
				frm.set_value('custom_branch', doc.branch);
				frm.set_value('custom_state', doc.state);
				frm.set_value('custom_zone_no', doc.zone);
				frm.set_value('custom_district', doc.district);
				frm.set_value('custom_branch_code', doc.branch_code);
			});
		}
	}
});

frappe.ui.form.on('Project', {
	refresh: function (frm) {
		if (!frm.is_new()) {
			const apr_btn = frm.add_custom_button(__('Approve'), function () {
				frappe.call({
					method: "bcms.building_construction_manufacturing_service.customization.project.project.workflow_state",
					args: {
						docname: frm.doc.name
					},
					callback: function (r) {
						if (r.message) {
							frappe.msgprint(r.message);
							frm.reload_doc();
						}
					}
				});
			});
			const rj_btn = frm.add_custom_button(__('Reject'), function () {
				frappe.call({
				    method: "bcms.building_construction_manufacturing_service.customization.project.project.reject_project",
				    args: {
				        docname: frm.doc.name
				    },
				    callback: function (r) {
				        if (r.message) {
				            frappe.msgprint(r.message);
				            frm.reload_doc();
				        }
				    }
				});
			});

			const r_review_btn = frm.add_custom_button(__('Request For Review'), function () {
				frappe.msgprint("Review Requested");
			});

			apr_btn.css({
				'background-color': 'Green',
				'color': 'White',
				'font-weight': 'bold'
			});

			rj_btn.css({
				'background-color': 'Red',
				'color': 'White',
				'font-weight': 'bold'
			});

			r_review_btn.css({
				'background-color': 'DarkBlue',
				'color': 'White',
				'font-weight': 'bold'
			});
		}
	}
});