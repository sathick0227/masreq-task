import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Modal, Box } from "@mui/material";
import Button from "../Button";
import { COLORS } from "../../utils/common-strings";
import { ErrorToast, SuccessToast } from "../../utils/functions";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";
import Form from "../Form";
const modalbox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "500px",
  height: "auto",
  transform: "translate(-50%, -50%)",
  borderRadius: "10px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 0,
};

export default function Table(rows: any) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>();
  const TableHead: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "firstname", headerName: "First name", width: 130 },
    { field: "middlename", headerName: "Middle name", width: 130 },
    { field: "lastname", headerName: "Last name", width: 130 },
    { field: "email", headerName: "Username", width: 170 },
    {
      field: "Actions",
      width: 180,
      renderCell: (params) => {
        return (
          <div>
            <Button
              color={COLORS.PRIMARY}
              onClick={() => handleEdit(params.row)}
              value="Edit"
            />
            <Button
              style={{ marginLeft: "10px" }}
              color={COLORS.ERROR}
              onClick={() => handleDelete(params.row.id)}
              value="Delete"
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {}, [currentData]);

  const handleDelete = (id: string) => {
    try {
      const users = doc(firestore, "user", id);
      deleteDoc(users);
      SuccessToast("Document deleted successfully");
    } catch (error) {
      ErrorToast("Error deleting documents");
    }
  };

  const handleEdit = (data: any) => {
    setCurrentData(data);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <Modal open={isOpen} onClose={() => setIsOpen(!isOpen)}>
          <Box sx={modalbox}>
            {currentData && (
              <Form
                handleClose={handleClose}
                datas={currentData}
                flag={"edit"}
              />
            )}
          </Box>
        </Modal>
        <DataGrid
          rows={rows.rows}
          columns={TableHead}
          pageSizeOptions={[0, 5, 25, 50]}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
        />
      </div>
    </>
  );
}
