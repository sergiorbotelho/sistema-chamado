import { useState, useEffect, useContext } from "react"
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlusCircle } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import { db } from "../../services/firebaseConnection"
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore"
import "./new.css"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
const listRef = collection(db, "customers")

export default function New() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const [customers, setCostumers] = useState([])
  const [loadCostumers, setLoadCostumers] = useState(true)
  const [customerSelected, setCustomerSelected] = useState(0)
  const [complemento, setComplemento] = useState("")
  const [idCustomer, setIdCustomer] = useState(false)
  const [assunto, setAssunto] = useState("Suporte")
  const [status, setStatus] = useState("Aberto")

  useEffect(() => {
    async function loadCostumers() {
      await getDocs(listRef)
        .then((snapshot) => {
          let lista = []
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeCliente: doc.data().nomeCliente,
            })
          })
          if (snapshot.docs.length === 0) {
            console.log("Nenhuma empresa encontrada")
            setCostumers([{ id: 1, nomeFantasia: "FREELA" }])
            setLoadCostumers(false)
            return
          }
          setCostumers(lista)
          setLoadCostumers(false)

          if (id) {
            loadId(lista)
          }
        })
        .catch((error) => {
          console.log(error)
          setLoadCostumers(false)
          setCostumers([{ id: 1, nomeFantasia: "FREELA" }])
        })
    }
    loadCostumers()
  }, [id])

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id)
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)

        let index = lista.findIndex(
          (item) => item.id === snapshot.data().clienteId
        )

        setCustomerSelected(index)
        setIdCustomer(true)
      })
      .catch((error) => {
        console.log(error)
        setIdCustomer(false)
      })
  }

  function handleOptionChange(e) {
    setStatus(e.target.value)
    console.log(e.target.value)
  }
  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value)
  }
  async function handleRegister(e) {
    e.preventDefault()

    if (idCustomer) {
      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeCliente,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso")
          setCustomerSelected(0)
          setComplemento("")
          navigate("/dashboard")
        })
        .catch((error) => {
          toast.error("Ops, erro ao atualizar esse chamado")
          console.log(error)
        })
      return
    }
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeCliente,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado registrado")
        setComplemento("")
        setCustomerSelected(0)
        navigate("/dashboard")
      })
      .catch((error) => {
        toast.error("Ops, algo deu errado, tente mais tarde")
        console.log(error)
      })
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title name={id ? "Editando chamado" : "Novo chamados"}>
          <FiPlusCircle size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Clientes</label>
            {loadCostumers ? (
              <input type="text" disabled={true} value={"Carregando..."} />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomer}>
                {customers.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nomeCliente}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assuntos</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              value={complemento}
              onChange={(text) => setComplemento(text.target.value)}
              type="text"
              placeholder="Descreva seu problema (Opcional)"
            ></textarea>
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  )
}
