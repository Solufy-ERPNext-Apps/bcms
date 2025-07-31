// Copyright (c) 2025, Shivangi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Additional Fund Request", {
	refresh(frm) {
        if (!frm.is_new() && frm.doc.workflow_state !== "Completed") {
			let apr_btn = frm.add_custom_button(__('Approve'), function () {
				// console.log("k22222222222222222222")
				// frm.save().then(() => {
					if (frm.is_dirty()) {
						frm.save()
					} 	
					frappe.call({
						method:"bcms.building_construction_manufacturing_service.doctype.additional_fund_request.additional_fund_request.change_in_approve",  
						args: {
							docname: frm.doc.name,
							workflow_state: frm.doc.workflow_state
						},
						callback: function (r) {
						if (r.message) {
							frappe.msgprint(__(r.message));
							frm.reload_doc();
							frappe.set_route("List", "Additional Fund Request");

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
                    method:"bcms.building_construction_manufacturing_service.doctype.additional_fund_request.additional_fund_request.reject_project",  
				    args: {
						docname:frm.doc.name,
						workflow_state:frm.doc.workflow_state
				    },
				    callback: function (r) {
				        if (r.message) {
				            frappe.msgprint(__(r.message));
							frm.reload_doc();
				            frappe.set_route("List", "Additional Fund Request");
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

frappe.ui.form.on('Additional Fund Request', {
	refresh: function(frm) {
		frappe.after_ajax(() => {
			setTimeout(() => {
				if (frm.page.sidebar) {
					const sidebar = frm.page.sidebar;
					frm.page.wrapper.find('.actions-btn-group:visible').first().css({'display':'none'});
				}   
			}, 0); 
		});
	}
});