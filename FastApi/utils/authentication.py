


def user_authentication(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not pwd_context.verify(password, user.password):
        return None
    return user