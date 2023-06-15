import "./modal.css"
import { FiX } from "react-icons/fi"
export default function Modal({ id = "modal", data, closeModal }) {
  function handleClose(e) {
    if (e.target.id === id) {
      closeModal()
    }
  }
  return (
    <div id={id} className="modal" onClick={handleClose}>
      <div className="container">
        <button onClick={() => closeModal()} className="close">
          <FiX size={24} color="#FFF" />
          <span>Voltar</span>
        </button>

        <main>
          <h2>Detalhe do chamado</h2>

          <div className="row">
            <span>
              Cliente: <i>{data.cliente}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Assunto: <i>{data.assunto}</i>
            </span>
            <span>
              Cadastrado em: <i>{data.createdFormat}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Status:{" "}
              <i
                style={{
                  color: "#FFF",
                  backgroundColor:
                    data.status === "Aberto" ? "#5cd85c" : "#999",
                }}
              >
                {data.status}
              </i>
            </span>
          </div>
          {data.complemento !== "" && (
            <>
              <h3>Complemento</h3>
              <p>{data.complemento}</p>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
