function Login() {
  return (
    <>
      <div className="w-screen h-screen bg-white flex justify-center items-center">
        <div className="w-1/4 h-1/2 bg-gray-200 rounded-2xl shadow-lg">
          <form
            action=""
            className="flex justify-start itens-center p-5 h-full flex-col gap-5"
          >
            <legend className="text-2xl text-center">
              Seja muito Bem-Vindo
            </legend>
            <h2 className="text-center text-[0.8rem]">
              Para começarmos digite seu E-Mail e Senha
            </h2>
            <div className=" flex flex-col justify-center h-full">
              <label typeof="email">E-Mail: </label>
              <input type="text" className="w-full h-1/8 p-3 rounded-4xl bg-white" />

              <label typeof="password">Senha: </label>
              <input type="text" className="w-full h-1/8 p-3 rounded-4xl bg-white" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
