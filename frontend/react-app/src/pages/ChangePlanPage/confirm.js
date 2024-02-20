import React, { useState } from "react";


import { useSelector } from "react-redux";


function Confirm() {

    const sessionUser = useSelector(state => state.session.user);

    const [selectedPlan, setSelectedPlan] = useState(sessionUser.plan);


    return (
        <div>
            "hi"
        </div>
    );
}

export default Confirm;
