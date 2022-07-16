export const userColumns = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Address",
    key: "address",
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
    key: "id",
    action: ["update", "read", "delete"],
  },
];
