import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';

const Create = () => {

    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [photo, setPhoto] = useState('');
    const [backErrors, setBackErrors] = useState({});
    const history = useHistory();

    const birthdayValidation = (incomingDate) => {
        if(!incomingDate) return false;
        const today = moment();
        const date = moment(incomingDate, 'YYYY-MM-DD');
        if (date.isBefore(today, 'day')) {
            return true;
        }
        return false;
    };

    const fileSelectHandler = event => {
        setPhoto(event.target.files[0])
    }
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const submitting = () => {
        // handleSubmit
        toggle();
    }
 
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

  return (
    <>
        <Formik
            initialValues={{
                name,
                birthday,
                photo,
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
                axios.post('http://localhost:2000/users/add/', dataToSave).then(() => {
                    console.log("Usuário cadastrado.")
                    toast.success('Usuario cadastrado')
                }).catch(() => {
                    console.log("Não foi possível cadastrar o usuário.")
                    toast.error('Não foi possível cadastrar o usuário.')
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
                            <h1>Criar usuário</h1>
                                <div>
                                    <Modal isOpen={modal} toggle={toggle} className="">
                                        <ModalHeader toggle={toggle}></ModalHeader>
                                        <ModalBody>
                                            Deseja cadastrar outro usuario?
                                        </ModalBody>
                                        <ModalFooter>
                                        <Button color="info" onClick={toggle}>Sim</Button>{' '}
                                        <Button color="warning" onClick={()=>history.push(`/`)}>Não</Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
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
                                    <small className="col-12 p-0 text-left text-danger">
                                        {(errors.name
                                            && touched.name
                                            && errors.name) || backErrors.name}
                                    </small>
                                </div>
                                <div className="col-3">
                                    <label>Nascimento</label>
                                    <input 
                                        name="birthday"
                                        type="date"
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
                                    <small className="col-12 p-0 text-left text-danger">
                                        {(errors.birthday
                                            && touched.birthday
                                            && errors.birthday) || backErrors.birthday}
                                    </small>
                                </div>
                            </div>
                            <div>
                                <Button color="info" onClick={()=> {toggle();handleSubmit()}}>Salvar</Button>{' '}
                                <Button color="warning" onClick={() => history.push("/")}>Cancelar</Button>{' '}
                            </div>
                        </form>
                    )
                }
        </Formik>
    </>
  );
}

export default Create;