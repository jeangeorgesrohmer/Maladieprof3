// Scores globaux  
let scores = {  
    diagnostic: 0,  
    professional: 0,  
    extraprofessional: 0,  
    specific: 0,  
    global: 0  
};  

document.addEventListener('DOMContentLoaded', function() {  
    console.log('DOM chargé - Initialisation de l\'application');  
    
    // Récupérer les boutons et attacher les événements  
    const calculateBtn = document.getElementById('calculate-btn');  
    const printBtn = document.getElementById('print-btn');  
    const exportPdfBtn = document.getElementById('export-pdf-btn');  
    const resetBtn = document.getElementById('reset-btn');  
    
    // Vérifier si les éléments existent avant d'ajouter les écouteurs d'événements  
    if (calculateBtn) {  
        calculateBtn.addEventListener('click', calculateScores);  
    } else {  
        console.error('Bouton de calcul non trouvé');  
    }  
    
    if (printBtn) {  
        printBtn.addEventListener('click', printReport);  
    }  
    
    if (exportPdfBtn) {  
        exportPdfBtn.addEventListener('click', generateDetailedPDF);  
    }  
    
    if (resetBtn) {  
        resetBtn.addEventListener('click', resetEvaluation);  
    }  
    
    // Définir la date d'évaluation par défaut à aujourd'hui  
    const today = new Date().toISOString().split('T')[0];  
    const evaluationDateInput = document.getElementById('evaluationDate');  
    if (evaluationDateInput) {  
        evaluationDateInput.value = today;  
    }  
    
    // Activer Bootstrap Tabs  
    const triggerTabList = [].slice.call(document.querySelectorAll('#evaluationTabs button'));  
    triggerTabList.forEach(function (triggerEl) {  
        const tabTrigger = new bootstrap.Tab(triggerEl);  
        triggerEl.addEventListener('click', function (event) {  
            event.preventDefault();  
            tabTrigger.show();  
        });  
    });  
    
    // Log pour débogage - vérifier les onglets  
    console.log('Nombre d\'onglets:', document.querySelectorAll('.nav-item').length);  
    document.querySelectorAll('.tab-pane').forEach(pane => {  
        console.log('Onglet:', pane.id, 'Nombre d\'éléments:', pane.querySelectorAll('*').length);  
    });  
});  

// Fonction pour calculer les scores de chaque section  
function calculateScores() {  
    console.log('Calcul des scores en cours...');  
    
    try {  
        // Réinitialiser les scores  
        scores = {  
            diagnostic: 0,  
            professional: 0,  
            extraprofessional: 0,  
            specific: 0,  
            global: 0  
        };  
        
        // 1. Calculer le score du module diagnostique et temporel (6 critères, max 30 points)  
        const diagnosticCriteria = [  
            'diagnostic-verification', 'symptom-severity', 'symptom-duration',  
            'symptom-onset', 'symptom-delay', 'symptom-evolution'  
        ];  
        
        scores.diagnostic = calculateSectionScore(diagnosticCriteria);  
        console.log('Score diagnostic:', scores.diagnostic);  
        
        // 2. Calculer le score des facteurs professionnels (8 critères, max 40 points)  
        const professionalCriteria = [  
            'workload', 'autonomy', 'social-support', 'recognition',  
            'emotional-demands', 'value-conflict', 'job-security', 'harassment'  
        ];  
        
        scores.professional = calculateSectionScore(professionalCriteria);  
        console.log('Score professionnel:', scores.professional);  
        
        // 3. Calculer le score des facteurs extraprofessionnels (8 critères, max 40 points)  
        const extraprofessionalCriteria = [  
            'personal-vulnerability', 'psychiatric-history', 'family-history', 'life-events',  
            'social-support-personal', 'family-difficulties', 'financial-difficulties', 'physical-health'  
        ];  
        
        scores.extraprofessional = calculateSectionScore(extraprofessionalCriteria);  
        console.log('Score extraprofessionnel:', scores.extraprofessional);  
        
        // 4. Calculer le score des critères spécifiques (3 critères, max 15 points)  
        const specificCriteria = [  
            'typical-profile', 'evaluator-consensus', 'similar-cases'  
        ];  
        
        scores.specific = calculateSectionScore(specificCriteria);  
        console.log('Score spécifique:', scores.specific);  
        
        // 5. Calculer le score global pondéré  
        // Formule: (Diagnostic*1.0 + Professionnel*1.2 + Extraprofessionnel*0.8 + Spécifique*1.5)  
        scores.global = Math.round(  
            (scores.diagnostic * 1.0) +  
            (scores.professional * 1.2) +  
            (scores.extraprofessional * 0.8) +  
            (scores.specific * 1.5)  
        );  
        
        console.log('Score global pondéré:', scores.global);  
        
        // Afficher les résultats  
        displayResults();  
        
        // Naviguer vers l'onglet des résultats  
        const resultsTab = document.getElementById('results-tab');  
        if (resultsTab) {  
            bootstrap.Tab.getInstance(resultsTab).show();  
        }  
        
        return true;  
    } catch (error) {  
        console.error('Erreur lors du calcul des scores:', error);  
        alert('Une erreur est survenue lors du calcul des scores. Veuillez vérifier que tous les champs sont correctement remplis.');  
        return false;  
    }  
}  

// Fonction pour calculer le score d'une section spécifique  
function calculateSectionScore(criteriaList) {  
    let sectionScore = 0;  
    
    criteriaList.forEach(criteria => {  
        const selectedOption = document.querySelector(`input[name="${criteria}"]:checked`);  
        if (selectedOption) {  
            sectionScore += parseInt(selectedOption.value);  
        }  
    });  
    
    return sectionScore;  
}  

// Fonction pour afficher les résultats  
function displayResults() {  
    console.log('Affichage des résultats...');  
    
    // Afficher les informations générales  
    document.getElementById('result-patient-name').textContent = document.getElementById('patientName').value || 'Non spécifié';  
    document.getElementById('result-evaluator-name').textContent = document.getElementById('evaluatorName').value || 'Non spécifié';  
    document.getElementById('result-evaluation-date').textContent = document.getElementById('evaluationDate').value || new Date().toISOString().split('T')[0];  
    
    const pathologyType = document.getElementById('pathologyType');  
    document.getElementById('result-pathology-type').textContent =   
        pathologyType.options[pathologyType.selectedIndex]?.text || 'Non spécifiée';  
    
    // Afficher les scores par section  
    document.getElementById('diagnostic-score').textContent = scores.diagnostic;  
    document.getElementById('professional-score').textContent = scores.professional;  
    document.getElementById('extraprofessional-score').textContent = scores.extraprofessional;  
    document.getElementById('specific-score').textContent = scores.specific;  
    document.getElementById('global-score').textContent = scores.global;  
    
    // Déterminer l'interprétation  
    const interpretationElement = document.getElementById('interpretation');  
    const interpretationText = document.getElementById('interpretation-text');  
    
    interpretationElement.className = 'alert';  
    
    if (scores.global < 70) {  
        interpretationElement.classList.add('low-probability');  
        interpretationText.textContent = 'Lien direct et essentiel peu probable (<25%)';  
    } else if (scores.global >= 70 && scores.global < 90) {  
        interpretationElement.classList.add('possible');  
        interpretationText.textContent = 'Lien direct et essentiel possible (25-50%)';  
    } else if (scores.global >= 90 && scores.global < 110) {  
        interpretationElement.classList.add('probable');  
        interpretationText.textContent = 'Lien direct et essentiel probable (50-75%)';  
    } else if (scores.global >= 110) {  
        interpretationElement.classList.add('highly-probable');  
        interpretationText.textContent = 'Lien direct et essentiel hautement probable (>75%)';  
    } else {  
        interpretationText.textContent = 'Évaluation incomplète';  
    }  
    
    // Rendre visible le conteneur de résultats  
    document.getElementById('results-container').classList.remove('d-none');  
}  

// Fonction pour imprimer le rapport  
function printReport() {  
    window.print();  
}  

// Fonction pour réinitialiser l'évaluation  
function resetEvaluation() {  
    // Réinitialiser les formulaires  
    document.querySelectorAll('input[type="radio"]').forEach(radio => {  
        radio.checked = false;  
    });  
    
    // Réinitialiser les informations générales  
    document.getElementById('patientName').value = '';  
    document.getElementById('evaluatorName').value = '';  
    document.getElementById('evaluationDate').value = new Date().toISOString().split('T')[0];  
    document.getElementById('pathologyType').selectedIndex = 0;  
    
    // Masquer les résultats  
    document.getElementById('results-container').classList.add('d-none');  
    
    // Retourner à l'onglet de diagnostic  
    const diagnosticTab = document.getElementById('diagnostic-tab');  
    if (diagnosticTab) {  
        bootstrap.Tab.getInstance(diagnosticTab).show();  
    }  
    
    // Réinitialiser les scores  
    scores = {  
        diagnostic: 0,  
        professional: 0,  
        extraprofessional: 0,  
        specific: 0,  
        global: 0  
    };  
}  

// Fonction pour générer un PDF détaillé  
function generateDetailedPDF() {  
    // S'assurer que les scores sont calculés  
    if (scores.global === 0) {  
        if (!calculateScores()) {  
            alert("Veuillez d'abord calculer les scores avant d'exporter le PDF.");  
            return;  
        }  
    }  
    
    // Récupérer les informations générales  
    const patientName = document.getElementById('patientName').value || 'Non spécifié';  
    const evaluatorName = document.getElementById('evaluatorName').value || 'Non spécifié';  
    const evaluationDate = document.getElementById('evaluationDate').value || new Date().toISOString().split('T')[0];  
    const pathologyType = document.getElementById('pathologyType');  
    const pathologyText = pathologyType.options[pathologyType.selectedIndex]?.text || 'Non spécifiée';  
    
    // Créer une nouvelle instance de jsPDF  
    const { jsPDF } = window.jspdf;  
    const doc = new jsPDF();  
    
    // Ajouter un en-tête  
    doc.setFillColor(52, 58, 64); // Couleur foncée pour l'en-tête  
    doc.rect(0, 0, 210, 20, 'F');  
    doc.setTextColor(255, 255, 255);  
    doc.setFontSize(14);  
    doc.setFont('helvetica', 'bold');  
    doc.text('RAPPORT D\'ÉVALUATION', 105, 12, { align: 'center' });  
    doc.setTextColor(0, 0, 0);  
    
    // Informations générales  
    doc.setFontSize(12);  
    doc.setFont('helvetica', 'bold');  
    doc.text('Informations générales', 20, 30);  
    doc.setFontSize(10);  
    doc.setFont('helvetica', 'normal');  
    doc.text(`Patient: ${patientName}`, 20, 40);  
    doc.text(`Évaluateur: ${evaluatorName}`, 20, 47);  
    doc.text(`Date d'évaluation: ${evaluationDate}`, 20, 54);  
    doc.text(`Pathologie: ${pathologyText}`, 20, 61);  
    
    let yPosition = 75;  
    
    // Collecter et afficher toutes les réponses  
    doc.setFontSize(12);  
    doc.setFont('helvetica', 'bold');  
    doc.text('Réponses sélectionnées', 20, yPosition);  
    yPosition += 10;  
    
    // Fonction pour ajouter une section au PDF  
    function addSection(title, selector, start