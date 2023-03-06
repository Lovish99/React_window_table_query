import React from "react";
import styled from "styled-components";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import scrollbarWidth from "./Scrollbarwidth";
import { useQuery } from "react-query";
import Axios from "axios";

import makeData from "./MakeData";

const listRef = React.createRef();

const SearchRow = (e) => {
  let rowNo = e.target.value;
  if (parseInt(rowNo)) {
    listRef.current.scrollToItem(parseInt(rowNo) - 1, "start");
  } else {
    listRef.current.scrollToItem(0, "start");
  }
};

const Styles = styled.div`
  padding: 1rem;
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <tr
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell) => {
            return (
              <td
                style={{
                  margin: "0",
                  padding: "0.5rem",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                }}
                {...cell.getCellProps()}
              >
                {cell.render("Cell")}
              </td>
            );
          })}
        </tr>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            style={{ border: "solid 1px black" }}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  border: "solid 1px black",
                  margin: "0",
                  padding: "0.5rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth + scrollBarSize}
          ref={listRef}
          style={{
            border: "solid 1px black",
          }}
        >
          {RenderRow}
        </FixedSizeList>
      </tbody>
    </table>
  );
}

function App(props) {
  const { data: any } = useQuery(["cat"], () => {
    return Axios.get("").then((res) => res.data);
  });

  const columns = React.useMemo(() => [
    {
      Header: "Row Index",
      accessor: (row, i) => i,
    },
    {
      Header: "Name",
      columns: [
        {
          Header: "First Name",
          accessor: "firstName",
        },
        {
          Header: "Last Name",
          accessor: "lastName",
        },
      ],
    },
    {
      Header: "Info",
      columns: [
        {
          Header: "Age",
          accessor: "age",
          width: 50,
        },
        {
          Header: "Visits",
          accessor: "visits",
          width: 60,
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Profile Progress",
          accessor: "progress",
        },
      ],
    },
  ]);

  const data = React.useMemo(() => makeData(100000), []);

  return (
    <Styles>
      <div style={{ width: "50%" }} className="header">
        <div className="col-search">
          <input onChange={SearchRow} placeholder="search" type="text" />
        </div>
      </div>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
