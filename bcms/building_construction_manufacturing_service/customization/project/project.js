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
		




			

frappe.ui.form.on('Project', {
	onload(frm) {
		setup_disbursement_events(frm);
		setup_additional_request_events(frm);
	},

	refresh(frm) {
		setup_disbursement_events(frm);
		setup_additional_request_events(frm);

		calculate_total_allocate_amount(frm);
		update_disbursement_status_from_last_row(frm);
	},

	validate(frm) {
		calculate_additional_required_amount(frm);
		calculate_total_allocate_amount(frm);
		calculate_disbursement_and_remaining(frm, true);
		update_disbursement_status_from_last_row(frm);
	},

	custom_project_allocated_amount(frm) {
		calculate_total_allocate_amount(frm);
	},

	custom_additional_require_amount(frm) {
		calculate_additional_required_amount(frm);
		calculate_total_allocate_amount(frm);
		calculate_disbursement_and_remaining(frm, false);
	},

	custom_suggested_by_member_incharge_a__f(frm) {
		update_project_allocated_from_suggestion(frm);
	}
});


function setup_disbursement_events(frm) {
	if (!frm.custom_disbursement_events_setup) {
		setTimeout(() => {
			const field = frm.fields_dict.custom_disbursement_detail;
			if (field && field.grid && typeof field.grid.on === 'function') {
				field.grid.on('child_change', () => {
					calculate_disbursement_and_remaining(frm, false);
					update_disbursement_status_from_last_row(frm);
					frm.dirty();
				});
				frm.custom_disbursement_events_setup = true;
			}
		}, 300); 
	}
}

function setup_additional_request_events(frm) {
	if (!frm.custom_additional_events_setup) {
		setTimeout(() => {
			const field = frm.fields_dict.custom_additional_request_details;
			if (field && field.grid && typeof field.grid.on === 'function') {
				field.grid.on('child_change', () => {
					calculate_additional_required_amount(frm);
					calculate_disbursement_and_remaining(frm, false);
					frm.dirty();
				});
				frm.custom_additional_events_setup = true;
			}
		}, 300); 
	}
}

function calculate_additional_required_amount(frm) {
	let total = 0;
	(frm.doc.custom_additional_request_details || []).forEach(row => {
		total += flt(row.approved_amount);
	});

	if (frm.doc.custom_additional_require_amount !== total) {
		frm.set_value("custom_additional_require_amount", total).then(() => frm.dirty());
	}
}

function calculate_total_allocate_amount(frm) {
	const base = flt(frm.doc.custom_project_allocated_amount);
	const additional = flt(frm.doc.custom_additional_require_amount);
	const total = base + additional;

	if (frm.doc.custom_total_allocated_amount !== total) {
		frm.set_value("custom_total_allocated_amount", total).then(() => frm.dirty());
	}

	calculate_disbursement_and_remaining(frm, false);
}

function calculate_disbursement_and_remaining(frm, validate_rows) {
	const total_allocated = flt(frm.doc.custom_total_allocated_amount);
	let total_approved = 0;

	for (const row of (frm.doc.custom_disbursement_detail || [])) {
		const approved = flt(row.approved_amount);
		const requested = flt(row.requested_amount);

		if (validate_rows && approved > requested) {
			frappe.throw(`Row ${row.idx}: Approved Amount (${approved}) cannot be greater than Requested Amount (${requested}).`);
		} else if (!validate_rows && approved > requested) {
			frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting approved_amount to 0.`);
			row.approved_amount = 0;
		}

		total_approved += row.approved_amount;
	}

	if (frm.doc.custom_disbursement_amount !== total_approved) {
		frm.set_value("custom_disbursement_amount", total_approved).then(() => frm.dirty());
	}

	if (total_approved > total_allocated) {
		const msg = "Total Disbursement exceeds Total Allocated Amount.";
		if (validate_rows) {
			frappe.throw(msg);
		} else {
			frappe.msgprint(msg);
		}
	}

	const remaining = total_allocated - total_approved;

	if (frm.doc.custom_remaining_amount !== remaining) {
		frm.set_value("custom_remaining_amount", remaining).then(() => frm.dirty());
	}
}

function update_disbursement_status_from_last_row(frm) {
	const disbursements = frm.doc.custom_disbursement_detail || [];

	if (disbursements.length > 0) {
		const last_row = disbursements[disbursements.length - 1];
		const status = last_row.current_state || "";

		if (frm.doc.custom_disbursement_status !== status) {
			frm.set_value("custom_disbursement_status", status).then(() => frm.dirty());
		}
	} else {
		if (frm.doc.custom_disbursement_status) {
			frm.set_value("custom_disbursement_status", "").then(() => frm.dirty());
		}
	}
}

function update_project_allocated_from_suggestion(frm) {
	const value = flt(frm.doc.custom_suggested_by_member_incharge_a__f);
	if (frm.doc.custom_project_allocated_amount !== value) {
		frm.set_value("custom_project_allocated_amount", value).then(() => frm.dirty());
	}
}
		}
	}
});

