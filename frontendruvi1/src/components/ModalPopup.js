import React from 'react';
import Popup from 'reactjs-popup';
import "./modal.css";
import { Avatar, Paper, TextField, Button, Grid, Box, Link, } from '@mui/material';

const ModalPopup = () => {
  return (
      <Popup trigger={<Button variant="contained" color="primary"> Open Modal </Button>} modal>
    <span> Modal content </span>
  </Popup>
  );
};
export default ModalPopup;