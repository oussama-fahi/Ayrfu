import { TextField } from '@mui/material';

const MotivationLetterStep = ({ letter, onChange }) => {
  return (
    <TextField
      label="Motivation Letter (optional)"
      multiline
      rows={6}
      fullWidth
      value={letter}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default MotivationLetterStep;
