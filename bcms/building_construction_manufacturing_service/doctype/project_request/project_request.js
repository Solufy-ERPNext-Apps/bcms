// frappe.ui.form.on('Project Request', {
// 	requested_by: function(frm) {
// 		if (frm.doc.requested_by) {
// 			frappe.db.get_doc('Employee', frm.doc.requested_by).then(employee => {
// 				frm.set_value('zone', employee.custom_zone);
// 				frm.set_value('unit', employee.custom_unit);
// 				frm.set_value('state', employee.custom_state);
// 				frm.set_value('khetra', employee.custom_khetra);
// 			});
// 		}
// 	},
	// zone: function(frm) { 
	// 	if(frm.doc.zone){
	// 		frappe.db.get_doc('Zone', frm.doc.zone).then(zone => {
	// 			frm.set_value('zonal_incharge_name', zone.zonal_incharge_name);
	// 			// frm.set_value('zone_email', zone.zone_email);
	// 			frm.set_value('member_incharge',zone.member_incharge);
	// 			frm.set_value('member_incharge_email',zone.member_incharge_email);
	// 			frm.set_value('member_incharge_name',zone.member_incharge_name);		
	// 	});
	// }
	// }
// });
// frappe.ui.form.on('Project Request',{
// 	estimated_budget:function(frm){
// 		get_in_words(frm,'estimated_budget','estimated_amount_in_words');
// 	},
// })
// function get_in_words(frm, source_field, target_field) {
// 	const value = frm.doc[source_field];
// 	if (value) {
// 		frappe.call({
// 			method: "bcms.building_construction_manufacturing_service.doctype.project_request.project_request.get_amount_in_words",
// 			args: { amount: value },
// 			callback: function(r) {
// 				if (r.message) {
// 					frm.set_value(target_field, r.message);
// 				}
// 			}
// 		});
// 	} else {
// 		frm.set_value(target_field, "");
// 	}
// }



frappe.ui.form.on("Project Request", {
  rank: function (frm) {
    if (!frm.doc.rank || !frm.doc.branch) return;

    
    frappe.db.get_list("Project Request", {filters: {"branch": frm.doc.branch, "rank": frm.doc.rank}, fields:["name", "approved_amount", "requested_by", "workflow_state"]}).then((result) => {
      let html = `<table style="width: 100%; font-size: 14px;" border="1">
        <tr>
          <tr>
            <td style="padding: 8px;">Name</td>
            <td style="padding: 8px;">Approved Amount</td>
            <td style="padding: 8px;">Requested By</td>
            <td style="padding: 8px;">Status</td>
          </tr>
        </tr>`
      result.forEach(element => {
        html += `
              <tr>
                <td style="padding: 8px;">${element.name}</td>
                <td style="padding: 8px;">${element.approved_amount}</td>
                <td style="padding: 8px;">${element.requested_by}</td>
                <td style="padding: 8px;">${element.workflow_state}</td>
              </tr>`;
      });
      html += ` </tbody>
          </table>
        `
        frm.set_value("previous_requests", html);
        frm.refresh_field("previous_requests");
    })
  }
});
