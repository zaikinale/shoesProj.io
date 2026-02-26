const LoadingScreen = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
    }}>
        <div style={{ textAlign: 'center' }}>
            <h2>Loading app...</h2>
            <p>Please wait.</p>
        </div>
    </div>
);

export { LoadingScreen }