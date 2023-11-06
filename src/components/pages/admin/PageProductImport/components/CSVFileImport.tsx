import axios, { AxiosError } from "axios";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useQuery } from "react-query";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    const authorization_token = localStorage.getItem("authorization_token");

    // Get the presigned URL
    if (file) {
      const response = await axios({
        method: "GET",
        url,
        headers: {
          Authorization: `Basic ${authorization_token}`,
        },
        params: {
          name: encodeURIComponent(file.name),
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data.url);
      const result = await fetch(response.data.url, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    }
  };

  const { data, refetch } = useQuery<any, AxiosError>(
    "uploadFile",
    uploadFile,
    {
      refetchOnWindowFocus: false,
      enabled: false, // disable this query from automatically running
    }
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={() => refetch()}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
