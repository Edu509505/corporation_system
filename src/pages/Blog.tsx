import { useState } from "react";

const mensagemCondicional = [
  {
    mensagemOkay:
      { titulo: 'Cadastrato realizado', mensagemTitulo: 'Cadastro realizado com sucesso!' }
  },
  {
    mensagemErro:
      { titulo: 'Erro ao cadastrar', mensagemTitulo: 'Não foi possível cadastrar' }
  }
]

function Blog() {

  const  sucesso = true
  const [mensagem, setMensagem] = useState({
    titulo: '',
    subTitulo: ''
  })

  return (
    <>
      {mensagemCondicional.map((m) => {
        setMensagem({
          ...mensagem,
          titulo: sucesso == true? m.mensagemOkay?.titulo : m.mensagemOkay?.titulo,
          subTitulo: sucesso == true? m.mensagemErro?.mensagemTitulo : m.mensagemErro?.titulo
          
        })
      })}
    </>
  );
}

export default Blog;
