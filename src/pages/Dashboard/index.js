import { useEffect, useState } from "react"
import Header from "../../components/Header"
import Modal from "../../components/Modal"

import Title from "../../components/Title"
import {
  FiMessageSquare,
  FiPlusCircle,
  FiSearch,
  FiEdit2,
} from "react-icons/fi"
import { Link } from "react-router-dom"
import "./dashboard.css"
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
} from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { format } from "date-fns"

const listRef = collection(db, "chamados")
export default function Dashboard() {
  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadMore, setLoadMore] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [detailItem, setDetailItem] = useState()

  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy("created", "desc"), limit(5))
      const querySnapshot = await getDocs(q)
      setChamados([])
      updateState(querySnapshot)
      setLoading(false)
    }
    loadChamados()
    return () => {}
  }, [])

  async function updateState(querySnapshot) {
    const isColletcionEnmpty = querySnapshot.size === 0

    if (!isColletcionEnmpty) {
      let lista = []
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      setLastDocs(lastDoc)
      setChamados((chamados) => [...chamados, ...lista])
    } else {
      setIsEmpty(true)
    }
    setLoadMore(false)
  }

  async function handleMore() {
    setLoadMore(true)
    const q = query(
      listRef,
      orderBy("created", "desc"),
      startAfter(lastDocs),
      limit(5)
    )

    const querySnapshot = await getDocs(q)
    await updateState(querySnapshot)
  }
  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamado...</span>
          </div>
        </div>
      </div>
    )
  }
  function handleModal(item) {
    setDetailItem(item)
    setOpenModal(!openModal)
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlusCircle size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlusCircle size={25} />
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Clientes</th>
                    <th scope="col">Assuntos</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Suporte">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                item.status === "Aberto" ? "#5cb85c" : "#999",
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#" className="btn-action">
                          <button
                            onClick={() => handleModal(item)}
                            className="action"
                            style={{ backgroundColor: "#3583f6" }}
                          >
                            <FiSearch color="#FFF" size={17} />
                          </button>
                          <Link
                            to={`/new/${item.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {loadMore && <h3>Buscando mais chamados...</h3>}
              {!loadMore && !isEmpty && (
                <button onClick={handleMore} className="btn-more">
                  Buscar mais
                </button>
              )}
            </>
          )}
        </>
        {openModal && (
          <Modal data={detailItem} closeModal={() => setOpenModal(false)} />
        )}
      </div>
    </div>
  )
}
