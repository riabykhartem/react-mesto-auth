import "../index.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate} from "react-router-dom";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";
import PopupWithForm from "./popupWithForm/PopupWithForm.jsx";
import PopupWithImage from "./popupWithImage/PopupWithImage.jsx";
import api from "../utils/api.js";
import CurrentUserContext from "./contexts/CurrentUserContext.js";
import EditProfilePopup from "./editProfilePopup/EditProfilePopup";
import EditAvatarPopup from "./editAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "./addPlacePopup/AddPlacePopup";
import ProtectedRouteElement from "./protetedRoute/ProtectedRoute";
import Register from "./Register/Register";
import Login from "./login/login"
import InfoTooltip from "./infoTooltip/InfoTooltip";
import auth from '../utils/auth'

function App() {
  //стейты
  const [loggedIn, setloggedIn] = useState(true);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [zoomedCard, setZoomedCard] = React.useState({});
  const [isZoomPopupOpen, setZoomedCardOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [initialCards, setInitialCards] = React.useState([]);
  const [isSignedup, setIsSignedup] = React.useState(true);
  const [isInfoTooltipPopupOpened, setisInfoTooltipPopupOpened] = React.useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  function tokenCheck(){
    if(!token){
      return
    }
    auth.getContent(token).then((res)=> {
      console.log(res.data._id)
      setCurrentUser({...currentUser, _id: res.data._id})
      console.log(currentUser)
    })
    .catch(err => console.error(`ошибка при получении данных пользователя: ${err}`))
  }

  useEffect(()=>{
    tokenCheck()
  },[])

  const navigate = useNavigate()


  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleCardClick(card) {
    setZoomedCard(card);
    setZoomedCardOpen(true);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setInitialCards((initialCards) =>
          initialCards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => `ошибка при нажатии лайка: ${err}`);
  }

  function handleCardDelete(deletedCardId) {
    api
      .deleteCard(deletedCardId)
      .then(
        setInitialCards(
          initialCards.filter((card) => {
            if (card._id === deletedCardId) {
              return null;
            } else {
              return card;
            }
          })
        )
      )
      .catch((err) => console.error(`ошибка при удалении карточки: ${err}`));
  }
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setZoomedCardOpen(false);
    setisInfoTooltipPopupOpened(false)
  }

  function handleUpdateUser(newUserData) {
    api
      .setUserInfo({ name: newUserData.name, about: newUserData.about })
      .then((res) =>
        setCurrentUser({
          name: res.name,
          about: res.about,
          avatar: currentUser.avatar,
        })
      )
      .then(() => closeAllPopups())
      .catch((err) =>
        console.error(`ошибка при редактировании профиля: ${err}`)
      );
  }

  function handleUpdateAvatar(newAvatar) {
    api
      .setAvatar(newAvatar)
      .then((res) => setCurrentUser({ ...currentUser, avatar: res.avatar }))
      .catch((err) => console.error(`ошибка при обновлении автара: ${err}`));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((dataCard) => setInitialCards([dataCard, ...initialCards]))
      .then(closeAllPopups())
      .catch((err) => `ошибка при добавлении новой карточки: ${err}`);
  }

  function handleSingUp(credentials){
    auth.register(credentials)
    .then((res) => console.log(res))
    .then(()=>{
      setIsSignedup(true)
      setisInfoTooltipPopupOpened(true)
    }
    )
    .catch((err) => console.error(`ошибка при регистрации: ${err}`))
  }
  function closeTooltipPopup(){
    navigate('/sign-in', {replace:true});
    closeAllPopups()
  }


  function handleSingIn(credentials){
    auth.login(credentials).then((res) =>{
      setToken(res.token)
      localStorage.setItem('token', res.token)
      setloggedIn(true)
      //получить id и записать его в currentUser?
      navigate('/',{replace:true})
    }).catch(err=>console.error(`Ошибка при логине: ${err}`))
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                element={
                  <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    initialCards={initialCards}
                    onLike={handleCardLike}
                    onDelete={handleCardDelete}
                  />
                }
                loggedIn={loggedIn}
              />
            }
          />
          <Route path="/sign-up" element={<Register onSubmit={handleSingUp}/>}/>
          <Route path="/sign-in" element={<Login onSubmit={handleSingIn}/>}/>
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpened={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        ></EditProfilePopup>

        <EditAvatarPopup
          isOpened={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        ></EditAvatarPopup>

        <AddPlacePopup
          isOpened={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onAddPlace={handleAddPlaceSubmit}
        ></AddPlacePopup>

        <PopupWithForm
          name="delete-card"
          title="Редактировать профиль"
          submitButtonValue="Да"
        />

        <PopupWithImage
          card={zoomedCard}
          isOpened={isZoomPopupOpen}
          onCardClick={handleCardClick}
          onClose={closeAllPopups}
        />
        <InfoTooltip isSignedup={isSignedup} isOpened={isInfoTooltipPopupOpened} onClose={closeTooltipPopup}>
        </InfoTooltip>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
