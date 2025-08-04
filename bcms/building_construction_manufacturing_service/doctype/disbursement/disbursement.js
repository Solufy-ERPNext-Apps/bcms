// Copyright (c) 2025, Shivangi and contributors
// For license information, please see license.txt
frappe.ui.form.on("Disbursement", {
	refresh(frm) {
        frappe.after_ajax(() => {
			setTimeout(() => {
				if (frm.page.sidebar) {
					const sidebar = frm.page.sidebar;
					frm.page.wrapper.find('.actions-btn-group:visible').first().css({'display':'none'});
				}   
			}, 0); 
		});
        if (!frm.is_new() && frm.doc.workflow_state !== "Completed") {
			let apr_btn = frm.add_custom_button(__('Approve'), function () {
					if (frm.is_dirty()) {
						frm.save()
					}
					frappe.call({
						method:"bcms.building_construction_manufacturing_service.doctype.disbursement.disbursement.change_in_approve",  
						args: {
							docname: frm.doc.name,
							workflow_state: frm.doc.workflow_state
						},
						callback: function (r) {
						if (r.message) {
							frappe.msgprint(__(r.message));
							frm.reload_doc();
							frappe.set_route("List", "Disbursement");

						}
					}
				// })
				});
			
			});
			apr_btn.css({
				'background-color': 'Green',
				'color': 'White',
				'font-weight': 'bold'
			});
		}

		if (!frm.is_new() && frm.doc.workflow_state !== "Pending" && frm.doc.workflow_state !== "Completed") {
			let rj_btn = frm.add_custom_button(__('Reject'), function () {
				frappe.call({
                    method:"bcms.building_construction_manufacturing_service.doctype.disbursement.disbursement.reject_project",  
				    args: {
						docname:frm.doc.name,
						workflow_state:frm.doc.workflow_state
				    },
				    callback: function (r) {
				        if (r.message) {
				            frappe.msgprint(__(r.message));
							frm.reload_doc();
				            frappe.set_route("List", "Disbursement");
				        }
				    }
				});
			});
			rj_btn.css({
				'background-color': 'Red',
				'color': 'White',
				'font-weight': 'bold'
			});
		}
	}
});
frappe.ui.form.on('Disbursement', {
	disbursement_amount: function(frm) {
		get_in_words(frm, 'disbursement_amount', 'disbursement_amount_in_words');
	},
	remaining_amount: function(frm) {
		get_in_words(frm, 'remaining_amount', 'remaining_amount_in_word');
	},
	total_expense:function(frm){
		get_in_words(frm,'total_expense','total_expense_in_words');
	},
	requested_amount:function(frm){
		get_in_words(frm,'requested_amount','requested_amount_in_words')
	}
});

function get_in_words(frm, source_field, target_field) {
	const value = frm.doc[source_field];
	if (value) {
		frappe.call({
			method: "bcms.building_construction_manufacturing_service.doctype.disbursement.disbursement.get_amount_in_words",
			args: { amount: value },
			callback: function(r) {
				if (r.message) {
					frm.set_value(target_field, r.message);
				}
			}
		});
	} else {
		frm.set_value(target_field, "");
	}
}