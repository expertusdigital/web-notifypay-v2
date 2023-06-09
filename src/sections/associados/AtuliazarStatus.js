
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
// material
import { Stack, TextField, FormControl, MenuItem, InputLabel, Typography, Snackbar} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { LoadingButton } from '@mui/lab';
// component
import axios from 'axios'
import {getTenant_id,getAcessToken} from '../../utils/services/auth'
import { Toast } from 'bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AtuliazarStatus(associado) {




  const [nome, setNome] = useState("");
  const [nome_artistico, setFantasia] = useState("");
  const [cnpf_cnpj, setCpfCnpj] = useState("");
  const [rua, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [data_nascimento,setData_nascimento] = useState("");
  const [pais, setPais] = useState("");
  const [status, setStatus] = useState("");
  const [valor, setValor] = useState(0);
  const [data_cobranca,setdateCobranca] = useState("");


  useEffect(() => {
    if(associado.associado!= null && associado.associado != 'undefined'){
      setNome(associado.associado.nome)
      setFantasia(associado.associado.nome_artistico)
      setCpfCnpj(associado.associado.cnpf_cnpj)
      setLogradouro(associado.associado.rua)
      setNumero(associado.associado.numero)
      setCidade(associado.associado.cidade)
      setUf(associado.associado.uf)
      setCep(associado.associado.cep)
      setTelefone1(associado.associado.telefone1)
      setTelefone2(associado.associado.telefone2)
      setEmail(associado.associado.email)
      setEmail2(associado.associado.email2)
      setData_nascimento(associado.associado.data_nascimento)
      setPais(associado.associado.pais)
  
    }
  });




  const tenant_id = JSON.parse(getTenant_id())
 
  var access_token = JSON.parse(getAcessToken())

  

  async function formAssociados() {
    await axios.post(`https://associados.api.expertusdigital.com/dashboard/${JSON.parse(getTenant_id())}/associados/atualizar/${associado.associado.id}`,{
 

          nome,
          nome_artistico,
          cnpf_cnpj,
          data_nascimento,

          rua,
          numero,
          cep,
          cidade,
          uf,
          pais,

          email,
          email2,
          telefone1,
          telefone2,

          status,
          data_cobranca,
          tenant_id

      
      },{
        headers: {
          'Authorization': `Bearer ${JSON.parse(getAcessToken())}`
        },
  
      } ).then((response) =>{
       
    })


 

 }
 
 async function formRelatorios() {
  await axios.post(`https://associados.api.expertusdigital.com/dashboard/${JSON.parse(getTenant_id())}/relatorios/add/`,{


        nome,
        nome_artistico,
        cnpf_cnpj,
        data_nascimento,

        rua,
        numero,
        cep,
        cidade,
        uf,
        pais,

        email,
        email2,
        telefone1,
        telefone2,

        status,
        data_cobranca,
        tenant_id

    
    },{
      headers: {
        'Authorization': `Bearer ${JSON.parse(getAcessToken())}`
      },

    } ).then((response) =>{
     
      if(response.status == 201){
      
       

        
        
      }
  })




}
const current = new Date();
const date = `${current.getMonth()+1}/${current.getFullYear()}`;


   const handleSubmit = async e => {
    e.preventDefault();
    console.log(valor)
    await  formAssociados()
    if(status === "aprovado"){await formRelatorios()}
    window.location.reload();
  }
 

  const handleChange = (event: SelectChangeEvent) => {

    setStatus(event.target.value );
  
  };


  return (
    <FormControl >
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
        <Typography style={tituloStatus}>Confirmar Pagamento</Typography>
          
        <TextField id="outlined-basic" label="Valor" variant="outlined" 
          onChange={(event) => {
            setStatus("aprovado")
            setdateCobranca(`${date}`)
            setValor(event.target.value);
          }}
        />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" >
           Confirmar
          </LoadingButton>



        </Stack>
      </form>
    </FormControl>
  );
}

const tituloStatus = {
 marginBottom: 15,
 fontSize: 18,
 fontWeight: 600,
 
}

const stackSelect = {
  marginBottom: 15
}

const tituloHelpText = {
  fontSize: 14,
  fontWeight: 600,
}

const conteudoHelpText = {
  fontSize: 12,
  fontWeight: 400,
}
