import React from "react";
import './APIForm.css';

function APIForm({ dog, fetchDog, banList, banAttribute, unbanAttribute, history }) {
    return (
        <div className="items">

            <div className="Seen-History">
                <h2>Seen History</h2>
                {history.map((entry, idx) => (
                    <div key={idx}>
                        <img src={entry.url} alt="dog" width="200" />
                        <p><strong>Breed:</strong> {entry.breeds[0]?.name}</p>
                        <p><strong>Origin:</strong> {entry.breeds[0]?.origin || "Unknown"}</p>
                        <p><strong>Characteristics:</strong> {entry.breeds[0]?.temperament}</p>
                    </div>
                ))}
            </div>
            
            <div className="current-dog">
                <button onClick={fetchDog}>Discover a Dog</button>

                {dog && (
                    <div>
                        <img src={dog.url} alt="dog" width="300" />
                        <p>
                            <strong>Breed:</strong>{" "}
                            <span
                                onClick={() => banAttribute(dog.breeds[0]?.name)}
                            >
                                {dog.breeds[0]?.name}
                            </span>
                        </p>
                        <p>
                            <strong>Origin:</strong>{" "}
                            <span
                                onClick={() => banAttribute(dog.breeds[0]?.origin || "Unknown")}
                            >
                                {dog.breeds[0]?.origin || "Unknown"}
                            </span>
                        </p>
                        <p>
                            <strong>Characteristics:</strong>{" "}
                            {dog.breeds[0]?.temperament
                                ?.split(", ")
                                .map((trait) => (
                                    <span
                                        key={trait}
                                        onClick={() => banAttribute(trait)}
                                    >
                                        {trait}
                                    </span>
                                ))}
                        </p>
                    </div>
                )}
            </div>

            <div className="Ban-List">
                <h2>Ban List</h2>
                {banList.length === 0 ? (
                    <p>Nothing is banned yet.</p>
                ) : (
                    banList.map((item) => (
                        <p key={item} onClick={() => unbanAttribute(item)}>
                            {item} (click to unban)
                        </p>
                    ))
                )}
            </div>
        </div>
    );
}

export default APIForm;