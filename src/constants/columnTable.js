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
