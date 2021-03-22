import React, {useState, useEffect} from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik } from 'formik';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';

const Edit = (props) => {

  const id = props.match.params.id;
  const [userInfo, setUserInfo] = useState('');

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [photo, setPhoto] = useState('');
  const [backErrors, setBackErrors] = useState({});
  const fileSelectHandler = event => {
    setPhoto(event.target.files[0])
  }

  const birthdayValidation = (incomingDate) => {
    if(!incomingDate) return false;
    const today = moment();
    const date = moment(incomingDate, 'YYYY-MM-DD');
    if (date.isBefore(today, 'day')) {
        return true;
    }
    return false;
  };

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
        .nullable()
        .trim()
        .required('Campo obrigatório'),
    birthday: Yup.string()
        .nullable()
        .trim()
        .test('associatedBirthdate', 'Data de nascimento deve ser anterior a data atual', (value) => birthdayValidation(value))
        .required('Campo obrigatório'),
  });

  useEffect(() => {
    axios.get(`http://localhost:2000/users/view/${id}`)
    .then(res => {
      setUserInfo(res.data);
    })
  },[id])
  return (
    <>
    <Formik
            initialValues={{
                name: userInfo.name,
                birthday:  moment(userInfo.birthday).utc().format('DD/MM/YYYY'),
                photo: userInfo.photo,
            }}
            enableReinitialize
            validationSchema={ValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              let dataToSave = {
                  name: name,
                  birthday: birthday,
                  photo: photo
              }
              axios.post(`http://localhost:2000/users/update/${id}`, dataToSave).then(() => {
                  console.log("Usuário atualizado.")
                  toast.success('Usuário atualizado')
              }).catch(() => {
                console.log("Não foi possível atualizar o usuário.")
                toast.error('Não foi possível atualizar o usuário.')
            });
              setSubmitting(true);
          }}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                }) => (
                        <form className="user__form">
                          <h1>Editar usuário</h1>
                          <img src="/matador.jpg"/>
                          <div className="row mt-3 mb-3 ml-0">
                              <div className="mt-3">
                                  <input type="file" onChange={fileSelectHandler}/>
                              </div>
                          </div>
                          <div className="row mt-3 mb-3">
                            <div className="col-4">
                                <label>Nome</label>
                                <input 
                                  name="name"
                                  type="text"
                                  className="form-control" 
                                  onChange={(name) => {
                                    setName(name.target.value);
                                    setFieldValue(
                                        'name',
                                        name.target.value,
                                    );
                                }}
                                  value={values.name}
                                />
                            </div>
                            <div className="col-3">
                                <label>Nascimento</label>
                                <input
                                type="date"
                                name="birthday"
                                className="form-control"
                                onChange={(birthday) => {
                                    setBirthday(birthday.target.value);
                                    setFieldValue(
                                        'birthday',
                                        birthday.target.value,
                                    );
                                }}
                                autoComplete="off"
                                value={values.birthday}
                                />
                            </div>
                          </div>
                          <div>
                              <Link to="/edit" className="btn btn-info mr-4 mb-2" onClick={handleSubmit}>Salvar</Link>
                              <Link to="/" className="btn btn-warning mr-4 mb-2">Cancelar</Link>
                          </div>
                        </form>
                    )
                }
        </Formik>
    </>
  );
}

export default Edit;