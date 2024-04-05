import { DataGrid } from "@mui/x-data-grid";
// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from "@prisma/client";
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
export default function Home({ data: defaultData }) {
  const [data, setData] = useState(defaultData);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  useEffect(() => {
    fetch(`/api?page=${paginationModel.page}&rpp=${paginationModel.pageSize}`)
      .then((res) => res.json())
      // eslint-disable-next-line no-shadow
      .then((data) => setData(data));
  }, [paginationModel]);

  const columns = [
    {
      field: "name",
      label: "Name",
    },
    {
      field: "email",
      label: "Email",
    },
    {
      field: "password",
      label: "Password",
    },
  ];

  return (
    <DataGrid
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      rows={data}
      columns={columns}
      rowCount={1000}
    />
  );
}

const prisma = new PrismaClient();
export const getServerSideProps = async () => {
  const data = await prisma.user.findMany({
    take: 10,
  });

  return {
    props: {
      data: data.map(({ createdAt, updatedAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt.toLocaleString(),
        updatedAt: updatedAt.toLocaleString(),
      })),
    },
  };
};
