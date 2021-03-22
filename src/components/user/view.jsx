import React, {useState, useEffect} from 'react';
import { Link, useHistory} from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment';

const View = (props) => {

  const id = props.match.params.id;
  const [userInfo, setUserInfo] = useState('');
  const history = useHistory();

  useEffect(() => {
    Axios.get(`http://localhost:2000/users/view/${id}`)
    .then(res => {
      setUserInfo(res.data);
    })
  },[id])
  return (
    <>
      <div className="user__form">
        <h1>Visualizar usuário</h1>
        <img src={userInfo.photo}/>
        {console.log('userInfo',userInfo)}
        <div>
          <img src="/matador.jpg" className="style.user__img"/>
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-4">
              <label>Nome</label>
              <input 
                className="form-control" 
                value={userInfo.name}
                disabled
              />
          </div>
          <div className="col-2">
              <label>Nascimento</label>
              <input 
                className="form-control" 
                value={
                  userInfo.birthday ?
                  moment(userInfo.birthday).utc().format('DD/MM/YYYY') : "Não informado"}
                disabled
              />
          </div>
        </div>
        <div>
            <Link onClick={()=>history.push(`/edit/${id}`)} className="btn btn-info mr-4 mb-2">Editar</Link>
            <Link to="/" className="btn btn-warning mr-4 mb-2">Cancelar</Link>
        </div>
      </div>
    </>
  );
}

export default View;