frappe.ui.form.on("Project",{
    refresh:function(frm){
        cur_frm.remove_custom_button('Duplicate Project with Tasks', 'Actions');
        cur_frm.remove_custom_button('Update Total Purchase Cost', 'Actions'); 
        cur_frm.remove_custom_button('Set Project Status', 'Actions');
      }
})

// frappe.ui.form.on('Project', {
//     refresh: function(frm) {
//         if (frm.doc.workflow_state === "Sent For Recommendation" && !frm.doc.custom_recommendation_letter ) {
//                frappe.throw(",test");
//         }
//     }
// });


// frappe.ui.form.on('Project', {
//     refresh: function(frm) {
//         console.log("Current State:", frm.doc.workflow_state);
//         console.log("Attachment Field:", frm.doc.custom_recommendation_letter);

//         if (frm.doc.workflow_state === "Sent For Recommendation" && !frm.doc.custom_recommendation_letter) {
//             frappe.throw("📎 Recommendation Letter is required.");
//         }
//     }
// });
