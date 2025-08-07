frappe.ui.form.on("Project Request", {
  refresh(frm) {
        frappe.after_ajax(() => {
			setTimeout(() => {
				if (frm.page.sidebar) {
					const sidebar = frm.page.sidebar;
					frm.page.wrapper.find('.actions-btn-group:visible').first().css({'display':'none'});
				}   
			}, 0); 
		});
        if (!frm.is_new() && frm.doc.workflow_state !== "Approved") {
			let apr_btn = frm.add_custom_button(__('Approve'), function () {
					if (frm.is_dirty()) {
						frm.save()
					}
					frappe.call({
						method:"bcms.building_construction_manufacturing_service.doctype.project_request.project_request.change_in_approve",  
						args: {
							docname: frm.doc.name,
							workflow_state: frm.doc.workflow_state
						},
						callback: function (r) {
						if (r.message) {
							frappe.msgprint(__(r.message));
							frm.reload_doc();
							frappe.set_route("List", "Project Request");

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
                    method:"bcms.building_construction_manufacturing_service.doctype.project_request.project_request.reject_project",  
				    args: {
						docname:frm.doc.name,
						workflow_state:frm.doc.workflow_state
				    },
				    callback: function (r) {
				        if (r.message) {
				            frappe.msgprint(__(r.message));
							frm.reload_doc();
				            frappe.set_route("List", "Project Request");
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
	},
  onload: function(frm){
    frm.set_value("fiscal_year", erpnext.utils.get_fiscal_year(frappe.datetime.get_today()))
  },
  estimated_budget:function(frm){
    // if (frm.doc.estimated_budget && frm.doc.estimated_budget > frm.doc.remaining_amount){
    // //   frm.set_value("estimated_budget", 0);
    //   frm.refresh_field("estimated_budget")
    //   frappe.throw(__("Estimated Amount can not be more than remaining amount"))
    // }
    get_in_words(frm,'estimated_budget','estimated_amount_in_words');
	},
  total_expense_limit: function(frm){
    get_in_words(frm,'total_expense_limit','total_expense_in_words');
  },
  remaining_amount: function(frm){
    get_in_words(frm,'remaining_amount','remaining_amount_in_words');
  },
  approved_amount: function(frm){
    get_in_words(frm,'approved_amount','approved_amount_in_words');
  },
  rank: function (frm) {
    if (!frm.doc.rank || !frm.doc.branch) return;

    frappe.db.get_list("Project Request", { filters: { "branch": frm.doc.branch, "rank": frm.doc.rank, "fiscal_year": frm.doc.fiscal_year}, fields: ["name", "approved_amount", "request_raised_by", "workflow_state"] }).then((result) => {
      let html = `<table style="width: 100%; font-size: 14px;" border="1">
        <tr>
          <tr>
            <td style="padding: 8px;"><b>Name</b></td>
            <td style="padding: 8px;"><b>Approved Amount</b></td>
            <td style="padding: 8px;"><b>Requested By</b></td>
            <td style="padding: 8px;"><b>Status</b></td>
          </tr>
        </tr>`
      let have_data = false
      let total_approved_amount = 0
      result.forEach(element => {
        if (element.workflow_state == "Approved") {
          total_approved_amount += element.approved_amount
        }
        have_data = true
        html += `
              <tr>
                <td style="padding: 8px;">${element.name}</td>
                <td style="padding: 8px;">${element.approved_amount}</td>
                <td style="padding: 8px;">${element.request_raised_by || ""}</td>
                <td style="padding: 8px;">${element.workflow_state}</td>
              </tr>`;
      });
      html += ` </tbody>
            </table>
          `
      frm.set_value("remaining_amount", frm.doc.total_expense_limit - total_approved_amount)
      frm.refresh_field("remaining_amount");
      if (have_data){
        frm.set_value("previous_requests", html);
        frm.refresh_field("previous_requests");
      }
    })
  }
});


function get_in_words(frm, source_field, target_field) {
	const value = frm.doc[source_field];
	if (value) {
		frappe.call({
			method: "bcms.building_construction_manufacturing_service.doctype.project_request.project_request.get_amount_in_words",
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