import React from "react"
import Particles from 'react-tsparticles'
import { loadFull } from "tsparticles";
 
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Box,
  Card,
  Modal,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../../../components/Page';

import Scrollbar from '../../../components/Scrollbar';
import 'react-toastify/dist/ReactToastify.css';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar,UserMoreMenu } from '../../../sections/@dashboard/user';
// mock
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

import api from '../../../utils/api';
import {getAcessToken , getTenant_id} from '../../../utils/services/auth'
import NewwAssociados from '../../../sections/associados'
import AtuliazarAssociados from '../../../sections/associados/AtuliazarAssociados'

import AtuliazarStatus from '../../../sections/associados/AtuliazarStatus'
import {formatData, maskCpfCnpj} from '../../../utils/Functions'
import { ToastContainer } from "react-bootstrap";



// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'nome', label: 'Nome Completo', alignRight: false },
  { id: 'nome_artistico', label: 'Nome artístico', alignRight: false },
  { id: 'cnpf_cnpj', label: 'CPF/CNPJ', alignRight: false },
  { id: 'telefone1', label: 'Telefone', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'status', label: 'Pag pendentes', alignRight: false },
  { id: 'data_cobranca', label: 'Data de renovação', alignRight: false }


];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    
    return filter(array, (_user) => 
    _user.data_cobranca.toLowerCase().indexOf(query.toLowerCase()) !== -1   || 
    _user.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1            || 
    _user.cnpf_cnpj.toLowerCase().indexOf(query.toLowerCase()) !== -1       ||
    _user.status.toLowerCase().indexOf(query.toLowerCase()) !== -1          ||
    _user.nome_artistico.toLowerCase().indexOf(query.toLowerCase()) !== -1  ||
    _user.telefone1.toLowerCase().indexOf(query.toLowerCase()) !== -1       ||
    _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1    
     );  
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function StatusAssociados() {
  

  const [fetchedData, setFetchedData] = useState([]);



  useEffect(() => {
    const getData = async () => {
      const data = await api.api.get(`dashboard/${JSON.parse(getTenant_id())}/associados`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(getAcessToken())}`
        }
        })
    
      
      setFetchedData(data.data.reverse());
    };
   
    getData();
  }, []);

  
 
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fetchedData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fetchedData.length) : 0;

  const filteredUsers = applySortFilter(fetchedData, getComparator(order, orderBy), filterName);      
  
  const isUserNotFound = filteredUsers.length === 0;

 

  const [associado , setAssociado] = useState();

  async function formGetAssociado(id) {
    await api.api.get(`dashboard/${JSON.parse(getTenant_id())}/associados/buscar/${id}`,{
       headers: {
         'Authorization': `Bearer ${JSON.parse(getAcessToken())}`
       },
 
     } ).then((response) =>{
      
   
   
      setAssociado(response.data)
   })


 }
 

    const [editStatus, setEditStatus] = useState(false);
    const OpenStatus = (id) =>{
      try {
        formGetAssociado(id);
      } catch (error) {
        
      }
      setEditStatus(true);
      
   }
   
   const EditCloseStatus = (event) =>{
       event.preventDefault();
       setEditStatus(false);
   }
   
   console.log(filteredUsers)

  return (
    <Page title="Clientes">   
       <ToastContainer/>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

         
         
            <Button    to="#" style={statusAbout} >
              <Stack direction={{ xs: 'column', sm: 'column', mt: 5 }}  fullWidth  style={stackSelect} >

                <Stack direction={{ xs: 'column', sm: 'column', mt: 5 }}  fullWidth  style={stackSelect} >
                  <Typography style={tituloHelpText} color="black">Os status podem variar nas seguintes opções a baixo:</Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row'}}  fullWidth  style={stackSelect} >
                  <Stack direction={{ xs: 'column', sm: 'column'}}  fullWidth  style={stackOptions} >
                    <Typography style={tituloHelpText} color="green">Aprovado</Typography>
                    <Typography style={conteudoHelpText}>Pagmento Realizado</Typography>
                  </Stack>

                  
                  <Stack direction={{ xs: 'column', sm: 'column' }}  fullWidth  style={stackOptions} >
                    <Typography style={tituloHelpText} color="#eed269">Pendente</Typography>
                    <Typography style={conteudoHelpText}>Pagamento a ser realizado</Typography>
                  </Stack>
                </Stack>
                
              </Stack>
           </Button>

       
         
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />


            
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={fetchedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />


          
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id , nome , data_cobranca,telefone1,cnpf_cnpj,nome_artistico,email,status } = row;
                    const isItemSelected = selected.indexOf(nome) !== -1;
                      if(status === "pendente"){
                           
                    return (  

                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                     
                       >
                      
                          <TableCell align="center">{nome}</TableCell>
                          <TableCell align="center">{nome_artistico}</TableCell>
                          <TableCell align="center">{maskCpfCnpj(cnpf_cnpj)}</TableCell>
                          <TableCell align="center">{telefone1}</TableCell>
                          <TableCell align="center">{email}</TableCell>
       
                          <TableCell align="center">
                            <MenuItem  to="#" onClick={() => OpenStatus(id)} style={colorStatus(status)}>
                              
                              <ListItemText primary={status}  primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>

                            <Modal open={editStatus} onClose={EditCloseStatus} >
                              <Box >
                                <Card style={modalStyle}>
                                  <AtuliazarStatus associado={associado}></AtuliazarStatus>
                                </Card>
                              </Box>
                            </Modal>
                          </TableCell>

                          <TableCell align="left">{formatData(data_cobranca)}</TableCell>

                          

                      </TableRow>
                    );
                      }
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody >
                    <TableRow    >
                      <TableCell align="center" colSpan={12} sx={{ py: 3 }} > 
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
        
        </Card>
    
        
    </Page>
  );
}


const statusAbout = {
 
}
const modalStyle = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #f2f2f2',

  padding: '1em',

}

const modalStyleAlert = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #f2f2f2',
  boxShadow: 25,
  padding: '1em',
  display: 'flex',
  flexDirection: 'column',
  width: '300px'

}

const boxAlert = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '1em'
}

const colorStatus = (status) => {

if(status == "pendente"){
  const color= {
    background: "#FFA319",
    borderRadius: 20,
    textAlign: "center",
    color: "black"
  }
  return color
}else if(status == "aprovado"){
  const color= {
    background: "#57CA22",
    borderRadius: 20,
    textAlign: "center",
    color: "black"
  }
  return color
}


}

const tituloStatus = {
  marginBottom: 15,
  fontSize: 18,
  fontWeight: 600,
  
 }
 
 const stackSelect = {
   marginBottom: 15
 }

 const stackOptions = {
  marginTop: 15,
  marginBottom: 15,
  marginLeft: 0,
  marginRight: 20
 }
 
 const tituloHelpText = {
   fontSize: 15,
   fontWeight: 600,
 }
 
 const conteudoHelpText = {
   fontSize: 13,
   fontWeight: 500,
   color: "black"
 }
 