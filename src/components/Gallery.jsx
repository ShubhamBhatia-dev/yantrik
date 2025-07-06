// Gallery.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylings/Gallery.css';

const Gallery = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('All');
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGalleryItems();
    }, [filter]);

    const fetchGalleryItems = async () => {
        try {
            setLoading(true);
            const params = filter !== 'All' ? { category: filter } : {};
            const response = await axios.get('http://localhost:5000/api/gallery', { params });
            setGalleryItems(response.data);
            console.log(response.data)
        } catch (err) {
            setError('Failed to fetch gallery items');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-wrapper">
            <h1 className="gallery-heading">Events Gallery</h1>
            <p className="gallery-subheading">
                Explore our journey through images - from workshop sessions to competition victories.
            </p>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : error ? (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={fetchGalleryItems}>Try Again</button>
                </div>
            ) : (
                <div className="gallery-grid">
                    {galleryItems.map((item, index) => (
                        <div key={item._id} className="gallery-item" onClick={() => setSelectedItem(item)}>
                            <img src={item.image} alt={item.title} className="gallery-img" />
                            <div className="overlay">
                                <span className="title">{item.title}</span>
                                <span className="category">{item.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedItem && (
                <div className="modal" onClick={() => setSelectedItem(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setSelectedItem(null)}>&times;</span>
                        <img src={selectedItem.image} alt={selectedItem.title} className="modal-img" />
                        <h2>{selectedItem.title}</h2>
                        <p>{selectedItem.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
