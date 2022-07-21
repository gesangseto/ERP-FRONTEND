export const userColumns = [
  {
    title: "ID",
    key: "user_id",
  },
  {
    title: "Name",
    key: "user_name",
  },
  {
    title: "Email",
    key: "user_email",
  },
  {
    title: "Address",
    key: "user_address",
  },
  {
    title: "Status",
    key: "status",
    render: (i, rec) => (
      <p style={{ color: rec.status ? "green" : "red" }}>
        {rec.status ? "Active" : "Inactive"}
      </p>
    ),
  },
  {
    title: "Action",
    key: "user_id",
    action: ["update", "read", "delete"],
  },
];
export const departColumns = [
  {
    title: "ID",
    key: "user_department_id",
  },
  {
    title: "Code",
    key: "user_department_code",
  },
  {
    title: "Name",
    key: "user_department_name",
  },
  {
    title: "Status",
    key: "status",
    render: (i, rec) => (
      <p style={{ color: rec.status ? "green" : "red" }}>
        {rec.status ? "Active" : "Inactive"}
      </p>
    ),
  },
  {
    title: "",
    key: "user_department_id",
    action: ["approve", "update", "read", "delete"],
  },
];
export const sectionColumns = [
  {
    title: "ID",
    key: "user_section_id",
  },
  {
    title: "Dept Code",
    key: "user_department_code",
  },
  {
    title: "Dept Name",
    key: "user_department_name",
  },
  {
    title: "Code",
    key: "user_section_code",
  },
  {
    title: "Name",
    key: "user_section_name",
  },
  {
    title: "Status",
    key: "status",
    render: (i, rec) => (
      <p style={{ color: rec.status ? "green" : "red" }}>
        {rec.status ? "Active" : "Inactive"}
      </p>
    ),
  },
  {
    title: "",
    key: "user_section_id",
    action: ["approve", "update", "read", "delete"],
  },
];
export const roleColumns = [
  {
    title: "ID",
    key: "user_section_id",
  },
  {
    title: "Dept Code",
    key: "user_department_code",
  },
  {
    title: "Dept Name",
    key: "user_department_name",
  },
  {
    title: "Code",
    key: "user_section_code",
  },
  {
    title: "Name",
    key: "user_section_name",
  },
  {
    title: "Status",
    key: "status",
    render: (i, rec) => (
      <p style={{ color: rec.status ? "green" : "red" }}>
        {rec.status ? "Active" : "Inactive"}
      </p>
    ),
  },
  {
    title: "",
    key: "user_section_id",
    action: ["approve", "update", "read"],
  },
];
