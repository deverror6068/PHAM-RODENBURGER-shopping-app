const data = require('../cpu.json') // localisation du fichier json conteant les données des articles

exports.getcpu = (req, res) => {
    const id = parseInt(req.params.id);
    const cpu = data.intel;


    if (!cpu){
        res.status(404).send('cpu not found')  // récupère les données pour un seul article

    }
    res.status(200).json({
    
        message: "cpu found succesfully",
        cpu
    });
    
};

exports.getcpus = (req, res) => {  // récupère les données pour tous les  articles

    const cpus = data.intel;

    if (!cpus){
        res.status(404).send('cpu not found')

    }
    res.status(200).json({
    
        message: "cpu found succesfully",
        cpus
    });
    
};

