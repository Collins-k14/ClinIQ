import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { symptomService } from '../services/symptomsService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

export default function SymptomDetail() {
  const { id } = useParams();
  const [symptomCheck, setSymptomCheck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptomCheck = async () => {
      try {
        const data = await symptomService.getSymptomCheckById(id);
        setSymptomCheck(data);
      } catch (error) {
        console.error('Error loading symptom check:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptomCheck();
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!symptomCheck)
    return <p className="text-center text-gray-600">Symptom details not found</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link to="/dashboard" className="text-primary-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <Card className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Symptom Details</h2>

        <p className="text-gray-700">
          <strong>Symptoms:</strong> {symptomCheck.symptoms.join(', ')}
        </p>
        <p className="text-gray-700 mt-2">
          <strong>Severity:</strong> {symptomCheck.triageResult?.severity}
        </p>
        <p className="text-gray-700 mt-2">
          <strong>Recommendation:</strong> {symptomCheck.triageResult?.recommendation}
        </p>
        <p className="text-gray-700 mt-2">
          <strong>Self-care advice:</strong> {symptomCheck.triageResult?.selfCareAdvice}
        </p>

        <div className="mt-4">
          <strong>Date:</strong>{' '}
          {new Date(symptomCheck.createdAt).toLocaleString()}
        </div>
      </Card>
    </div>
  );
}
