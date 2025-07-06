import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../stylings/Events.css';

const Parallax = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events'); // Replace with your actual backend URL
                setEvents(res.data);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <>
            <div className="parallax-overallWrap">
                <div className="parallax-wrapper">
                    <section>
                        <div className="parallax-bg parallax-bg0">
                            <h1 className="parallax-title">
                                <span>E</span><span>V</span><span>E</span><span>N</span><span>T</span><span>S</span>
                            </h1>
                        </div>

                        <div className="Event-content">
                            <p className="parallax-text">
                                Yantrik is a prominent student club at IIT Mandi, known for its innovation and dynamic presence under the Science and Technology Council...
                            </p>

                            {/* Dynamically render events */}
                            {events.map((event, index) => (
                                <React.Fragment key={event._id}>
                                    <div
                                        className="parallax-bg"
                                        style={{ backgroundImage: `url(${event.imageUrl})` }}
                                    >
                                        <h2 className="parallax-desc">{event.title}</h2>
                                    </div>
                                    <p className="parallax-text">{event.description}</p>
                                </React.Fragment>
                            ))}
                        </div>
                    </section>
                </div>


            </div>

        </>
    );
};

export default Parallax;
