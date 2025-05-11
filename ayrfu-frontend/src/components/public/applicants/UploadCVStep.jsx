import { Button, Typography } from '@mui/material';

const UploadCVStep = ({ file, onChange }) => {
  return (
    <>
      <Typography variant="body1" mb={2}>Upload your CV (PDF, DOCX)</Typography>
      <Button variant="contained" component="label">
        Choose File
        <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => onChange(e.target.files[0])} />
      </Button>
      {file && (
        <Typography mt={2}>Selected: {file.name}</Typography>
      )}
    </>
  );
};

export default UploadCVStep;
