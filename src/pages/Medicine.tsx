import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Search, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface MedicineInfo {
  name: string;
  genericName?: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  precautions: string[];
  brandNames: string[];
  alternatives: string[];
  category: string;
}

export default function Medicine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMedicine = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setMedicineInfo(null);

    try {
      // First check cache
      const { data: cached } = await supabase
        .from('medicine_cache')
        .select('medicine_data')
        .eq('medicine_name', searchTerm.toLowerCase())
        .single();

      if (cached) {
        setMedicineInfo(cached.medicine_data as unknown as MedicineInfo);
        setLoading(false);
        return;
      }

      // If not cached, call AI function
      const { data, error: funcError } = await supabase.functions.invoke('medicine-lookup', {
        body: { medicineName: searchTerm }
      });

      if (funcError) throw funcError;
      
      setMedicineInfo(data.medicineInfo);

      // Cache the result
      await supabase
        .from('medicine_cache')
        .insert({
          medicine_name: searchTerm.toLowerCase(),
          medicine_data: data.medicineInfo
        });

    } catch (err: any) {
      setError(err.message || 'Failed to fetch medicine information');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchMedicine();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Medicine Information</h1>
        <p className="text-muted-foreground">
          Search for detailed information about medicines, including uses, dosage, side effects, and precautions.
        </p>
      </div>

      {/* Disclaimer */}
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This information is AI-generated and for educational purposes only. 
          Always consult with healthcare professionals before taking any medication. Do not use this as a substitute for professional medical advice.
        </AlertDescription>
      </Alert>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Medicine</CardTitle>
          <CardDescription>
            Enter the medicine name to get detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter medicine name (e.g., Aspirin, Paracetamol)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={searchMedicine} disabled={loading || !searchTerm.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {medicineInfo && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {medicineInfo.name}
                <Badge variant="secondary">{medicineInfo.category}</Badge>
              </CardTitle>
              {medicineInfo.genericName && (
                <CardDescription>Generic Name: {medicineInfo.genericName}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Uses */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Uses
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {medicineInfo.uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Dosage */}
              <div>
                <h3 className="font-semibold mb-2">Dosage</h3>
                <p className="text-sm bg-muted p-3 rounded-md">{medicineInfo.dosage}</p>
              </div>

              <Separator />

              {/* Side Effects */}
              <div>
                <h3 className="font-semibold mb-2 text-orange-600">Side Effects</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {medicineInfo.sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Precautions */}
              <div>
                <h3 className="font-semibold mb-2 text-red-600">Precautions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {medicineInfo.precautions.map((precaution, index) => (
                    <li key={index}>{precaution}</li>
                  ))}
                </ul>
              </div>

              {/* Brand Names */}
              {medicineInfo.brandNames.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Brand Names</h3>
                    <div className="flex flex-wrap gap-2">
                      {medicineInfo.brandNames.map((brand, index) => (
                        <Badge key={index} variant="outline">{brand}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Alternatives */}
              {medicineInfo.alternatives.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Alternatives</h3>
                    <div className="flex flex-wrap gap-2">
                      {medicineInfo.alternatives.map((alt, index) => (
                        <Badge key={index} variant="secondary">{alt}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Always verify this information with your healthcare provider. Drug interactions, allergies, and individual health conditions can affect safety and effectiveness.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}