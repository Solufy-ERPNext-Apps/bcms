// Copyright (c) 2025, Shivangi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Additional Fund Request", {
	refresh(frm) {
        if (!frm.is_new() && frm.doc.workflow_state !== "Approved") {
			let apr_btn = frm.add_custom_button(__('Approve'), function () {
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

		if (!frm.is_new() && frm.doc.workflow_state !== "Pending" && frm.doc.workflow_state !== "Approved") {
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


frappe.ui.form.on('Additional Fund Request', {
    requested_amount(frm) {
        get_amount_in_words(frm, 'requested_amount', 'requested_amount_in_words');
    },
    suggested_by_building_department(frm) {
        get_amount_in_words(frm, 'suggested_by_building_department', 'suggested_by_building_department_in_words');
    },
    suggested_by_member_incharge_pp(frm) {
        get_amount_in_words(frm, 'suggested_by_member_incharge_pp', 'suggested_by_member_incharge_pp_in_words');
    },
    suggested_by_secretory_snm(frm) {
        get_amount_in_words(frm, 'suggested_by_secretory_snm', 'suggested_by_secretory_snm_in_words');
    },
    amount_approved_by_member_incharge(frm) {
        get_amount_in_words(frm, 'amount_approved_by_member_incharge', 'amount_approved_by_member_incharge_a_and__f_in_words');
    }
});

function get_amount_in_words(frm, source_field, target_field) {
    const value = frm.doc[source_field];
    if (value) {
        frappe.call({
            method: "bcms.building_construction_manufacturing_service.customization.project.project.get_amount_in_words",
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


frappe.ui.form.on('Additional Fund Request', {
    refresh(frm) {
        if (
            frm.doc.workflow_state === "Completed" &&
            frm.doc.amount_approved_by_member_incharge &&
            frm.doc.project
        ) {
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Project",
                    name: frm.doc.project
                },
                callback: function (r) {
                    if (!r.exc) {
                        let existing_detail = r.message.custom_additional_fund_request_detail || "";

                        let existing_rows = '';
                        const match = existing_detail.match(/<table[^>]*>.*?<tr>.*?<\/tr>(.*?)<\/table>/s);
                        if (match && match[1]) {
                            existing_rows = match[1].trim();
                        }

                        const new_row = `
                            <tr>
                                <td>${frm.doc.requested_by}</td>
                                <td>₹ ${frm.doc.requested_amount}</td>
                                <td>₹ ${frm.doc.amount_approved_by_member_incharge}</td>
                                <td>Member Incharge (PP)</td>
                            </tr>
                        `;

                        const final_html = `
                            <table>
                                <tr>
                                    <td><b>Requested By</b></td>
                                    <td><b>Requested Amount</b></td>
                                    <td><b>Approved Amount</b></td>
                                    <td><b>Approved By</b></td>
                                </tr>
                                ${existing_rows}
                                ${new_row}
                            </table>
                        `;

                        frappe.call({
                            method: "frappe.client.set_value",
                            args: {
                                doctype: "Project",
                                name: frm.doc.project,
                                fieldname: {
                                    "custom_additional_fund_request_detail": final_html
                                }
                            }
                        });
                    }
                }
            });
        }
    }
});
