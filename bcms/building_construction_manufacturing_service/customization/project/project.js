frappe.ui.form.on("Project", {
  custom_branch: function (frm) {
    if (frm.doc.custom_branch && frm.doc.project_type) {
      frm.set_value(
        "project_name",
        frm.doc.project_type + " at " + frm.doc.custom_branch
      );
    }
  },
  project_type: function (frm) {
    if (frm.doc.custom_branch && frm.doc.project_type) {
      frm.set_value(
        "project_name",
        frm.doc.project_type +
          " at " +
          frm.doc.custom_zone_no +
          frm.doc.custom_branch_code
      );
    }
  },
  refresh: function (frm) {
    cur_frm.remove_custom_button("Set Project Status", "Actions");
    cur_frm.remove_custom_button("Duplicate Project with Tasks", "Actions");
    cur_frm.remove_custom_button("Update Total Purchase Cost", "Actions");
    cur_frm.remove_custom_button("Set Project Status", "Actions");
    cur_frm.remove_custom_button("Gantt Chart", "View");
    cur_frm.remove_custom_button("Kanban Board", "View");
  },
});

frappe.ui.form.on("Estimate", {
  quantity: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.quantity && row.rate) {
      row.amount = flt(row.quantity) * flt(row.rate);
      frm.refresh_field("estimate_items");
    }
    frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce(
      (sum, item) => {
        return sum + flt(item.amount);
      },
      0
    );
    frm.refresh_field("custom_total_amount");
  },
  rate: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.quantity && row.rate) {
      row.amount = flt(row.quantity) * flt(row.rate);
      frm.refresh_field("estimate_items");
    }
    frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce(
      (sum, item) => {
        return sum + flt(item.amount);
      },
      0
    );
    frm.refresh_field("custom_total_amount");
  },
  amount: function (frm, cdt, cdn) {
    frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce(
      (sum, item) => {
        return sum + flt(item.amount);
      },
      0
    );
    frm.refresh_field("custom_total_amount");
  }
});

frappe.ui.form.on("Estimate", {
      quantity: function (frm, cdt, cdn) {
      const row = locals[cdt][cdn];
          if (row.quantity && row.rate) {
          row.amount = flt(row.quantity) * flt(row.rate);
          frm.refresh_field("estimate_items");
          }
          frm.doc.custom_total_boq_amount = frm.doc.custom_bill_of_quantities.reduce(
          (sum, item) => {
          return sum + flt(item.amount);
          },
          0
          );
          frm.refresh_field("custom_total_boq_amount");
          },
          rate: function (frm, cdt, cdn) {
          const row = locals[cdt][cdn];
          if (row.quantity && row.rate) {
          row.amount = flt(row.quantity) * flt(row.rate);
          frm.refresh_field("estimate_items");
          }
          frm.doc.custom_total_boq_amount= frm.doc.custom_bill_of_quantities.reduce(
          (sum, item) => {
          return sum + flt(item.amount);
          },
          0
          );
          frm.refresh_field("custom_total_boq_amount");
          },
          amount: function (frm, cdt, cdn) {
          frm.doc.custom_total_boq_amount = frm.doc.custom_bill_of_quantities.reduce(
          (sum, item) => {
          return sum + flt(item.amount);
      },
      0
);
frm.refresh_field("custom_total_boq_amount");
}
});

frappe.ui.form.on("Financial Approval", {
  estimated_cost: function (frm, cdt, cdn) {
    frm.doc.custom_total_estimated_cost =
      frm.doc.custom_financiallll_approval.reduce((sum, item) => {
        return sum + flt(item.estimated_cost);
      }, 0);
    frm.refresh_field("custom_total_estimated_cost");
  },
});

frappe.ui.form.on("Custom Disbursement Detail", {
  custom_disbursement_detail_add: function (frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    const today = frappe.datetime.get_today();
    row.posted_on = today;
    refresh_field("custom_disbursement_detail");
  },
});

frappe.ui.form.on("Project", {
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
  },
});
frappe.ui.form.on("Project", {
  refresh: function (frm) {
    frappe.after_ajax(() => {
      setTimeout(() => {
        if (frm.page.sidebar) {
          const sidebar = frm.page.sidebar;

          sidebar.find('.sidebar-menu a:contains("See on Website")').hide();
          sidebar.find(".form-stats-likes").hide();
          sidebar.find(".comment-icon").hide();
          sidebar.find(".ml-2").hide();
          sidebar.find(".modified-by").hide();
          sidebar.find(".mx-2").hide();
          sidebar.find(".created-by").hide();
          sidebar.find(".comments").hide();
          sidebar.find(".form-tags").hide();
          sidebar.find(".form-shared").hide();
          sidebar.find(".icon-sm").hide();
          sidebar.find(".form-follow").hide();
          frm.page.wrapper.find(".comment-box").css({ display: "none" });
          $(".form-assignments").hide();
          frm.page.wrapper
            .find(".scroll-to-top btn btn-default icon-btn")
            .css({ display: "none" });
          frm.page.wrapper
            .find(".actions-btn-group:visible")
            .first()
            .css({ display: "none" });
        }
      }, 0);
    });
  },
});
frappe.ui.form.on("Project", {
  branch: function (frm) {
    if (frm.doc.branch) {
      frappe.db.get_doc("Branch", frm.doc.branch).then(function (doc) {
        frm.set_value("custom_branch", doc.branch);
        frm.set_value("custom_state", doc.state);
        frm.set_value("custom_zone_no", doc.zone);
        frm.set_value("custom_district", doc.district);
        frm.set_value("custom_branch_code", doc.branch_code);
      });
    }
  },
});

function approve_button_fun(frm) {
  frm.doc.save()
  frappe.call({
    method:
      "bcms.building_construction_manufacturing_service.customization.project.project.workflow_state",
    args: {
      docname: frm.doc.name,
      project_type: frm.doc.project_type,
      workflow_state: frm.doc.workflow_state,
    },
    callback: function (r) {
      console.log(r);
      if (r.message) {
        frappe.msgprint(__("Project Approved"));
        frm.reload_doc();
        frappe.set_route("List", "Project");
      }
    },
  });
}

function reject_button_fun(frm) {
  frm.doc.save()
  frappe.call({
    method:
      "bcms.building_construction_manufacturing_service.customization.project.project.reject_project",
    args: {
      docname: frm.doc.name,
      project_type: frm.doc.project_type,
      workflow_state: frm.doc.workflow_state,
    },
    callback: function (r) {
      if (r.message) {
        frappe.msgprint(__("Project Rejected"));
        frm.reload_doc();
        frappe.set_route("List", "Project");
      }
    },
  });
}

frappe.ui.form.on("Project", {
  refresh: function (frm) {
    frm.set_df_property('custom_land_detail_lc', 'cannot_add_rows', true);
    const approved_fields = [
      "custom_approved",
      "custom_approved1",
      "custom_approved2",
      "custom_approved3",
      "custom_approved4",
      "custom_approved5",
      "custom_approved6",
      "custom_approved7",
    ];
    const reject_fields = [
      "custom_reject",
      "custom_reject1",
      "custom_reject2",
      "custom_reject3",
      "custom_reject4",
      "custom_reject5",
      "custom_reject6",
      "custom_reject7",
    ];

    setTimeout(() => {
      approved_fields.forEach((field) => {
        let btn = frm
          .get_field(field)
          .$wrapper.find("button.btn.btn-xs.btn-default");

        if (btn.length) {
          btn.css({
            "background-color": "#008000",
            "border-color": "#008000",
            color: "white",
            "font-weight": "bold",
          });
          btn.off("click");
          btn.on("click", () => {
            approve_button_fun(frm);
          });
        }
      });

      reject_fields.forEach((field) => {
        let btn = frm
          .get_field(field)
          .$wrapper.find("button.btn.btn-xs.btn-default");

        if (btn.length) {
          btn.css({
            "background-color": "#ff0000",
            "border-color": "#ff0000",
            color: "white",
            "font-weight": "bold",
          });
          btn.off("click");
          btn.on("click", () => {
            reject_button_fun(frm);
          });
        }
      });
    }, 500);

    if (!frm.is_new() && frm.doc.workflow_state !== "Work completion Certificate"
) 
{
      const apr_btn = frm.add_custom_button(__("Approve"), function () {
        if (frm.is_dirty()) {
          frm.save()
        }
        frappe.call({
          method:
            "bcms.building_construction_manufacturing_service.customization.project.project.workflow_state",
          args: {
            docname: frm.doc.name,
            project_type: frm.doc.project_type,
            workflow_state: frm.doc.workflow_state,
          },
          callback: function (r) {
            if (r.message) {
              frappe.msgprint(__("Project Approved"));
              frm.reload_doc();
              frappe.set_route("List", "Project");
            }
          },
        });
        if (frm.doc.workflow_state === "Final Project Planning"){
          console.log(frm.doc.name)
          frappe.call({
            method:"bcms.building_construction_manufacturing_service.customization.project.project.create_disbursement",
            args:{
              doc:frm.doc.name,
            }
          })
        }
      });
      apr_btn.css({
        "background-color": "Green",
        color: "White",
        "font-weight": "bold",
      });
    }
    if (
      !frm.is_new() &&
      frm.doc.workflow_state !== "Project Request" &&
      frm.doc.workflow_state !== "Work completion Certificate"
    ) {
      const rj_btn = frm.add_custom_button(__("Reject"), function () {
        frappe.call({
          method:
            "bcms.building_construction_manufacturing_service.customization.project.project.reject_project",
          args: {
            docname: frm.doc.name,
            project_type: frm.doc.project_type,
            workflow_state: frm.doc.workflow_state,
          },
          callback: function (r) {
            if (r.message) {
              console.log(r);
              frappe.msgprint(__("Project Rejected"));
              frm.reload_doc();
              frappe.set_route("List", "Project");
            }
          },
        });
      });
      rj_btn.css({
        "background-color": "Red",
        color: "White",
        "font-weight": "bold",
      });
    }
    if (
      !frm.is_new() &&
      frm.doc.workflow_state !== "Work completion Certificate"
    ) {
      const r_review_btn = frm.add_custom_button(__("Review"), function () {
        const dialog = new frappe.ui.Dialog({
          title: __("Request For Review"),
          fields: [
            {
              fieldname: "adhikari",
              fieldtype: "Link",
              options: "Employee",
              label: __("Adhikari"),
              reqd: 1,
            },
            {
              fieldname: "remarks",
              fieldtype: "Small Text",
              label: __("Remarks"),
              reqd: 1,
            },
          ],
        });
        dialog.show();
      });

      r_review_btn.css({
        "background-color": "DarkBlue",
        color: "White",
        "font-weight": "bold",
      });
      if (
        !frm.is_new() &&
        frm.doc.workflow_state !== "Project Request" &&
        frm.doc.workflow_state !== "Work completion Certificate"
      ) 
      {
        const dis_btn = frm.add_custom_button(
          __("Additional Fund Request"),
          function () {
            frappe.new_doc("Additional Fund Request", {
              project: frm.doc.name,
              project_name: frm.doc.project_name,
              project_type: frm.doc.project_type,
              branch: frm.doc.custom_branch,
              status: frm.doc.status,
            });
          }
        );
        dis_btn.css({
          "background-color": "Black",
          color: "White",
          "font-weight": "bold",
        });
      }

      frappe.ui.form.on("Project", {
        onload_post_render: function (frm) {
          frm.set_df_property(
            "custom_disbursement_detail",
            "cannot_delete_rows",
            true
          );
          frm.refresh_field("custom_disbursement_detail");

          frm.set_df_property(
            "custom_additional_request_details",
            "cannot_delete_rows",
            true
          );
          frm.refresh_field("custom_additional_request_details");
        },

        onload(frm) {
          frm.set_df_property(
            "custom_disbursement_detail",
            "cannot_delete_rows",
            true
          );
          frm.set_df_property(
            "custom_additional_request_details",
            "cannot_delete_rows",
            true
          );
          frm.refresh_field("custom_disbursement_detail");
          frm.refresh_field("custom_additional_request_details");
          setup_disbursement_events(frm);
          setup_additional_request_events(frm);
        },

        refresh(frm) {
          setup_disbursement_events(frm);
          setup_additional_request_events(frm);

          calculate_total_allocate_amount(frm);
          update_disbursement_status_from_last_row(frm);
          update_addtional_request_status_from_last_row(frm);
          frm.set_df_property(
            "custom_disbursement_detail",
            "cannot_delete_rows",
            true
          );
          frm.set_df_property(
            "custom_additional_request_details",
            "cannot_delete_rows",
            true
          );
          frm.refresh_field("custom_disbursement_detail");
          frm.refresh_field("custom_additional_request_details");
        },

        validate(frm) {
          let disbursement_errors = [];
          (frm.doc.custom_disbursement_detail || []).forEach((row) => {
            const approved = flt(row.approved_amount);
            const requested = flt(row.requested_amount);
            if (approved > requested) {
              disbursement_errors.push(
                `Disbursement Row ${row.idx}: Approved (${approved}) > Requested (${requested})`
              );
            }
          });

          let additional_errors = [];
          (frm.doc.custom_additional_request_details || []).forEach((row) => {
            const approved = flt(row.approved_amount);
            const requested = flt(row.requested_amount);
            if (approved > requested) {
              additional_errors.push(
                `Additional Request Row ${row.idx}: Approved (${approved}) > Requested (${requested})`
              );
            }
          });

          const all_errors = [...disbursement_errors, ...additional_errors];
          if (all_errors.length > 0) {
            frappe.throw(all_errors.join("<br>"));
          }

          // calculate_additional_required_amount(frm);
          calculate_total_allocate_amount(frm);
          calculate_disbursement_and_remaining(frm, true);
          update_disbursement_status_from_last_row(frm);
          update_addtional_request_status_from_last_row(frm);
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
        },
      });

      function setup_disbursement_events(frm) {
        if (!frm.custom_disbursement_events_setup) {
          setTimeout(() => {
            const field = frm.fields_dict.custom_disbursement_detail;
            if (field && field.grid && typeof field.grid.on === "function") {
              field.grid.on("child_change", () => {
                calculate_disbursement_and_remaining(frm, false);
                update_disbursement_status_from_last_row(frm);
                update_addtional_request_status_from_last_row(frm);
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
            if (field && field.grid && typeof field.grid.on === "function") {
              field.grid.on("child_change", () => {
                // calculate_additional_required_amount(frm);
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
        let updated = false;
        (frm.doc.custom_additional_request_details || []).forEach((row) => {
          if (row.current_state === "Approved") {
            const today = frappe.datetime.get_today();
            if (!row.approved_on || row.approved_on !== today) {
              row.approved_on = today;
              updated = true;
            }
            total += flt(row.approved_amount);
          }
        });

        if (frm.doc.custom_additional_require_amount !== total) {
          frm
            .set_value("custom_additional_require_amount", total)
            .then(() => frm.dirty());
        }

        if (updated) {
          frm.refresh_field("custom_additional_request_details");
          frm.dirty();
        }
      }

      function calculate_total_allocate_amount(frm) {
        const base = flt(frm.doc.custom_project_allocated_amount);
        const additional = flt(frm.doc.custom_additional_require_amount);
        const total = base + additional;

        if (frm.doc.custom_total_allocated_amount !== total) {
          frm
            .set_value("custom_total_allocated_amount", total)
            .then(() => frm.dirty());
        }

        calculate_disbursement_and_remaining(frm, false);
      }

      function calculate_disbursement_and_remaining(frm, validate_rows) {
        const total_allocated = flt(frm.doc.custom_total_allocated_amount);
        let total_approved = 0;

        for (const row of frm.doc.custom_disbursement_detail || []) {
          if (row.current_state !== "Disbursed") continue;
          const today = frappe.datetime.get_today();
          if (!row.approved_on || row.approved_on !== today) {
            row.approved_on = today;
            updated = true;
          }
          const approved = flt(row.approved_amount);
          const requested = flt(row.requested_amount);

          if (validate_rows && approved > requested) {
            frappe.throw(
              `Row ${row.idx}: Approved Amount (${approved}) cannot be greater than Requested Amount (${requested}).`
            );
          } else if (!validate_rows && approved > requested) {
            frappe.msgprint(
              `Row ${row.idx}: Approved > Requested. Resetting approved_amount to 0.`
            );
            row.approved_amount = 0;
          }

          total_approved += row.approved_amount;
        }

        if (frm.doc.custom_disbursement_amount !== total_approved) {
          frm
            .set_value("custom_disbursement_amount", total_approved)
            .then(() => frm.dirty());
        }

        if (total_approved > total_allocated) {
          const msg = "Total Disbursement exceeds Total Allocated Amount.";
          if (validate_rows) {
            frappe.throw(msg);
          } else {
            frappe.msgprint(msg);
          }
          calculate_disbursement_and_remaining;
        }

        const remaining = total_allocated - total_approved;

        if (frm.doc.custom_remaining_amount !== remaining) {
          frm
            .set_value("custom_remaining_amount", remaining)
            .then(() => frm.dirty());
        }
        if (
          remaining === 0 &&
          frm.doc.workflow_state === "Under Disbursement" &&
          frm.doc.__islocal !== 1
        ) {
          frm
            .set_value("workflow_state", "Work completion Certificate")
            .then(() => {
              frm.dirty();
            });
        }
      }

      function update_disbursement_status_from_last_row(frm) {
        const disbursements = frm.doc.custom_disbursement_detail || [];

        if (disbursements.length > 0) {
          const last_row = disbursements[disbursements.length - 1];
          const status = last_row.current_state || "";

          if (frm.doc.custom_disbursement_status !== status) {
            frm
              .set_value("custom_disbursement_status", status)
              .then(() => frm.dirty());
          }
        } else {
          if (frm.doc.custom_disbursement_status) {
            frm
              .set_value("custom_disbursement_status", "")
              .then(() => frm.dirty());
          }
        }
      }

      function update_addtional_request_status_from_last_row(frm) {
        const disbursements = frm.doc.custom_additional_request_details || [];

        if (disbursements.length > 0) {
          const last_row = disbursements[disbursements.length - 1];
          const status = last_row.current_state || "";

          if (frm.doc.custom_additional_request_status !== status) {
            frm
              .set_value("custom_additional_request_status", status)
              .then(() => frm.dirty());
          }
        } else {
          if (frm.doc.custom_additional_request_status) {
            frm
              .set_value("custom_additional_request_status", "")
              .then(() => frm.dirty());
          }
        }
      }

      function update_project_allocated_from_suggestion(frm) {
        const value = flt(frm.doc.custom_suggested_by_member_incharge_a__f);
        if (frm.doc.custom_project_allocated_amount !== value) {
          frm
            .set_value("custom_project_allocated_amount", value)
            .then(() => frm.dirty());
        }
      }
    }
  },
});

frappe.ui.form.on("Project", {
  custom_estimate_cost: function (frm) {
    get_in_words(
      frm,
      "custom_estimate_cost",
      "custom_estimate_cost_in_the_words"
    );
  },
  custom_total_estimated_cost: function (frm) {
    get_in_words(
      frm,
      "custom_total_estimated_cost",
      "custom_total_estimated_cost_in_site"
    );
  },
  custom_total_amount: function (frm) {
    get_in_words(frm, "custom_total_amount", "custom_total_amount_in_words");
  },
  custom_suggested_by_member_incharge_pp: function (frm) {
    get_in_words(
      frm,
      "custom_suggested_by_member_incharge_pp",
      "custom_amount_in_words_in_pp"
    );
  },
  custom_suggested_by_secretory_snm: function (frm) {
    get_in_words(
      frm,
      "custom_suggested_by_secretory_snm",
      "custom_amount_in_words_snm"
    );
  },
  custom_suggested_by_member_incharge_a__f: function (frm) {
    get_in_words(
      frm,
      "custom_suggested_by_member_incharge_a__f",
      "custom_amount_in_words_a__f"
    );
  },
  custom_project_allocated_amount: function (frm) {
    get_in_words(
      frm,
      "custom_project_allocated_amount",
      "custom_project_allocated_amount_in_words"
    );
  },
  custom_total_allocated_amount: function (frm) {
    get_in_words(
      frm,
      "custom_total_allocated_amount",
      "custom_total_allocated_amount_in_words"
    );
  },
  custom_disbursement_amount: function (frm) {
    get_in_words(
      frm,
      "custom_disbursement_amount",
      "custom_disbursement_amount_in_words"
    );
  },
  custom_remaining_amount: function (frm) {
    get_in_words(
      frm,
      "custom_remaining_amount",
      "custom_remaining_amount_in_words"
    );
  },
  custom_additional_require_amount: function (frm) {
    get_in_words(
      frm,
      "custom_additional_require_amount",
      "custom_additional_require_amount_in_words"
    );
  },
  custom_total_boq_amount: function (frm) {
    get_in_words(
      frm,
      "custom_total_boq_amount",
      "custom_total_amount_in_word"
    );
  },
});
function get_in_words(frm, source_field, target_field) {
  const value = frm.doc[source_field];
  if (value) {
    frappe.call({
      method:
        "bcms.building_construction_manufacturing_service.customization.project.project.get_amount_in_words",
      args: { amount: value },
      callback: function (r) {
        if (r.message) {
          frm.set_value(target_field, r.message);
        }
      },
    });
  } else {
    frm.set_value(target_field, "");
  }
}
frappe.ui.form.on("Project", {
  refresh: function (frm) {
    if (frm.doc.project_type == "Maintenance") {
      frm.add_custom_button(
        "Material Transfer",
        () => {
          frappe.model.open_mapped_doc({
            method:
              "bcms.building_construction_manufacturing_service.customization.project.project.create_stock_entry_from_project",
            frm: frm,
          });
        },
        "Create"
      );
      frm.add_custom_button(
        "Material Consumeption",
        () => {
          frappe.model.open_mapped_doc({
            method:
              "bcms.building_construction_manufacturing_service.customization.project.project.create_stock_entry_from_project",
            frm: frm,
          });
        },
        "Create"
      );
      frm.add_custom_button(
        "Material Return",
        () => {
          frappe.model.open_mapped_doc({
            method:
              "bcms.building_construction_manufacturing_service.customization.project.project.create_stock_entry_from_project",
            frm: frm,
          });
        },
        "Create"
      );
    }
  },
});

frappe.ui.form.on("Project", {
  custom_land: async function (frm) {
    if (!frm.doc.custom_land) return;

    try {
      const land = await frappe.db.get_doc("Land Details", frm.doc.custom_land);

      let branch_code = "";
      let zone_no = "";
      let zone_name = "";
      let zonal_incharge = "";
      let mobile_no = "";
      let bhavan_name = "";

      if (land.branch) {
        const branch = await frappe.db.get_doc("Branch", land.branch);
        branch_code = branch.custom_branch_code || "";
      }

      if (land.zone) {
        const zone = await frappe.db.get_doc("Zone", land.zone);
        zone_no = zone.zone_no || "";
        zone_name = zone.zone_name || "";
        zonal_incharge = zone.zonal_incharge || "";
        if (zonal_incharge) {
          const adhikari = await frappe.db.get_doc("Employee", zonal_incharge);
          mobile_no = adhikari.cell_number || "";
        }
      }

      if (land.bhavan) {
        const bhavan = await frappe.db.get_doc("Bhavan", land.bhavan);
        bhavan_name = bhavan.bhavan_name || land.bhavan;
      }

      const html = `
                <table style="border-collapse: collapse; width: 100%;" border="1">
                    <tr><td colspan="2" style="padding: 8px;text-align:center"><b>Land Deatils</b></td></tr>
                    <tr><td style="padding: 8px;">Branch</td><td style="padding: 8px;">${
                      land.branch || ""
                    }</td></tr>
                    <tr><td style="padding: 8px;">Branch Code</td><td style="padding: 8px;">${branch_code}</td></tr>
                    <tr><td style="padding: 8px;">Bhavan</td><td style="padding: 8px;">${bhavan_name}</td></tr>
                    <tr><td style="padding: 8px;">Zone</td><td style="padding: 8px;">${
                      land.zone || ""
                    }</td></tr>
                    <tr><td style="padding: 8px;">Zone No</td><td style="padding: 8px;">${zone_no}</td></tr>
                    <tr><td style="padding: 8px;">Zone Name</td><td style="padding: 8px;">${zone_name}</td></tr>
                    <tr><td style="padding: 8px;">Zonal Incharge</td><td style="padding: 8px;">${zonal_incharge}</td></tr>
                    <tr><td style="padding: 8px;">Mobile No</td><td style="padding: 8px;">${mobile_no}</td></tr>
                </table>
            `;

      frm.set_value("custom_land_summarys", html);
      frm.set_df_property("custom_land_summarys", "read_only", 1);
      frm.refresh_field("custom_land_summarys");
    } catch (error) {
      frappe.msgprint(__("Error fetching land details: ") + error.message);
    }
  },
});

//remove the add row option in the child table
frappe.ui.form.on("Project", {
  refresh(frm) {
    frm
      .get_field("custom_land_details_forms")
      .grid.wrapper.find(".grid-add-row")
      .hide();
    frm.fields_dict.custom_land_details_forms.grid.only_sortable();
  },
});

frappe.ui.form.on("Project", {
  // onload: function(frm) {
  //     // if (!frm.doc.custom_creation_date &&  frm.doc.creation) {
  //     //     const creation_date = frm.doc.creation.split(" ")[0];
  //     //     frm.set_value('custom_creation_date', creation_date);
  //     // }
  //     handle_work_completion(frm);
  // },
  // refresh: function(frm) {
  //     handle_work_completion(frm);
  // },
  // on_workflow_state_change: function(frm) {
  //     handle_work_completion(frm);
  // }
});

function handle_work_completion(frm) {
  if (frm.doc.workflow_state === "Work completion Certificate") {
    if (!frm.doc.custom_completion_date) {
      const today = frappe.datetime.now_date();
      frm.set_value("custom_completion_date", today);
    }
    if (frm.doc.custom_creation_date_ && frm.doc.custom_completion_date) {
      const start = frappe.datetime.str_to_obj(frm.doc.custom_creation_date_);
      const end = frappe.datetime.str_to_obj(frm.doc.custom_completion_date);

      const duration = get_duration_detail(start, end);
      frm.set_value("custom_duration", duration);
    }
    frm.set_df_property("custom_creation_date_", "read_only", 1);
    frm.set_df_property("custom_completion_date", "read_only", 1);
    frm.set_df_property("custom_duration", "read_only", 1);

    frm.refresh_fields();
  }
}
function get_duration_detail(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(" ") : "0 days";
}

frappe.ui.form.on("Project", {
  onload: function (frm) {
    if (
      frm.doc.custom_total_estimated_cost && !frm.doc.custom_suggested_by_member_incharge_pp && !frm.doc.custom_suggested_by_secretory_snm &&
      !frm.doc.custom_suggested_by_member_incharge_a__f
    ) {
      frm.set_value(
        "custom_suggested_by_member_incharge_pp",
        frm.doc.custom_total_estimated_cost
      );
      frm.set_value(
        "custom_suggested_by_secretory_snm",
        frm.doc.custom_total_estimated_cost
      );
      frm.set_value(
        "custom_suggested_by_member_incharge_a__f",
        frm.doc.custom_total_estimated_cost
      );
    }
    if(frm.doc.custom_total_amount && !frm.doc.custom_total_boq_amount){
      frm.set_value(
        "custom_total_boq_amount",
        frm.doc.custom_total_amount
      )
    }
  },
  custom_total_estimated_cost: function (frm) {
    if (frm.doc.custom_total_estimated_cost) {
      frm.set_value(
        "custom_suggested_by_member_incharge_pp",
        frm.doc.custom_total_estimated_cost
      );
      frm.set_value(
        "custom_suggested_by_secretory_snm",
        frm.doc.custom_total_estimated_cost
      );
      frm.set_value(
        "custom_suggested_by_member_incharge_a__f",
        frm.doc.custom_total_estimated_cost
      );
    }
  },
  custom_total_amount: function (frm) {
    if (frm.doc.custom_total_amount) {
      frm.set_value(
        "custom_total_boq_amount",
        frm.doc.custom_total_amount
      );
    }
  },
});


frappe.ui.form.on('Project', {
    onload(frm) {
        if (!frm.doc.custom_bill_of_quantities || frm.doc.custom_bill_of_quantities.length === 0) {
            if (frm.doc.custom_bill_of_quantity && frm.doc.custom_bill_of_quantity.length > 0) {
                bill_of_qty(frm);
            }
        }
    }
});

function bill_of_qty(frm) {
    frm.clear_table('custom_bill_of_quantities');

    frm.doc.custom_bill_of_quantity.forEach(row => {
        const new_row = frm.add_child("custom_bill_of_quantities");
        new_row.area = row.area;
        new_row.unit = row.unit;
        new_row.rate = row.rate;
        new_row.work = row.work;
        new_row.quantity = row.quantity;
        new_row.amount = row.amount;
    });

    frm.refresh_fields("custom_bill_of_quantities");
}


frappe.ui.form.on('Project', {
    refresh: function(frm) {
        fill_stages(frm);
    },
    custom_suggested_by_member_incharge_a__f: function(frm) {
        fill_stages(frm);
    },
    project_type: function(frm) {
        fill_stages(frm);
    }
});

function fill_stages(frm) {
    if (!frm.doc.project_type || !frm.doc.custom_suggested_by_member_incharge_a__f) return;

    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Project Type',
            name: frm.doc.project_type
        },
        callback: function(r) {
            if (r.message && Array.isArray(r.message.custom_percentage)) {
                const total_amount = frm.doc.custom_suggested_by_member_incharge_a__f;
                frm.clear_table('custom_disbursement_planning');

                r.message.custom_percentage.forEach(row => {
                    if (row.stages && row.percentage != null) {
                        const amount = (parseFloat(row.percentage) / 100) * total_amount;
                        frm.add_child('custom_disbursement_planning', {
                            state: row.stages,  
                            percentage: row.percentage,
                            amount: amount.toFixed(2)
                        });
                    }
                });

                frm.refresh_field('custom_disbursement_planning');
            }
        }
    });
}
