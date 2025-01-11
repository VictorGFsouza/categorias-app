import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaModal, setCategoriaModal] = useState({ codigo: null, titulo: "", descricao: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = "http://localhost:5082/api/Categoria";

  const buscarCategorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl, { params: { titulo: filtro } });
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
    setLoading(false);
  };

  const abrirModal = (categoria = { codigo: 0, titulo: "", descricao: "" }) => {
    setCategoriaModal(categoria);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setCategoriaModal({ codigo: 0, titulo: "", descricao: "" });
    setModalVisible(false);
  };

  const salvarCategoria = async () => {
    if (!categoriaModal.titulo || !categoriaModal.descricao) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (categoriaModal.codigo) {
        await axios.patch(`${apiUrl}/${categoriaModal.codigo}`, categoriaModal);
        alert("Categoria atualizada com sucesso!");
      } else {
        await axios.post(apiUrl, categoriaModal);
        alert("Categoria cadastrada com sucesso!");
      }
      fecharModal();
      buscarCategorias();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria.");
    }
  };

  const excluirCategoria = async (codigo) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }
    try {
      await axios.delete(apiUrl, { params: { codigoCategoria: codigo } });
      alert("Categoria excluída com sucesso!");
      buscarCategorias();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria.");
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Categorias</h1>
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          className="form-control w-100"
          placeholder="Filtrar por título"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button className="btn btn-primary mx-1" onClick={buscarCategorias}>
          Consultar
        </button>
        <button className="btn btn-success" onClick={() => abrirModal()}>
          Novo
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <tr key={categoria.codigo}>
                  <td>{categoria.codigo}</td>
                  <td>{categoria.titulo}</td>
                  <td>{categoria.descricao}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm mx-1"
                      onClick={() => abrirModal(categoria)}
                    >
                      Alterar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirCategoria(categoria.codigo)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {categoriaModal.codigo ? "Editar Categoria" : "Nova Categoria"}
                </h5>
                <button className="btn-close" onClick={fecharModal}></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    className="form-control"
                    value={categoriaModal.titulo}
                    onChange={(e) =>
                      setCategoriaModal({ ...categoriaModal, titulo: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    className="form-control"
                    value={categoriaModal.descricao}
                    onChange={(e) =>
                      setCategoriaModal({ ...categoriaModal, descricao: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={fecharModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={salvarCategoria}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
