import './Header.css'

function Header(props) {
    return (
        <div className="header">
            <div className="header__content">
                <p className="header__logo"><span className="header__logo-en">KanaBan</span></p> 
                <div className="header__nav">
                    <p className="header__nav-link">practice</p>
                    <p className="header__nav-link">reference</p>
                    <p className="header__nav-link">about</p>
                </div>
            </div>
        </div>
    )
}

export default Header