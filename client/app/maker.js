const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoPet").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="Name">&emsp;Name:&nbsp;</label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">&emsp;Age:&nbsp;</label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="pet">&emsp;Pet type:&nbsp;</label>
            <input id="domoPet" type="text" name="pet" placeholder="Domo Pet" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props){
    if(props.domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <div className="petDiv">
                    <h3 className="domoPet">Pet type: {domo.pet}</h3>
                    <button className="openPet" onClick={() => openPetWindow(domo.pet)}>Learn more about this animal</button>
                </div>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const openPetWindow = (_pet) => {
    window.open("https://en.wikipedia.org/wiki/" + _pet);
}

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
              <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});