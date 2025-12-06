'use client';

import { createAutopsyScenario } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useAutopsy } from './autopsy-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Dna, Hourglass, Loader2, Microscope, Stethoscope, Syringe } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

export default function AutopsyControls() {
  const { scenario, setScenario, isLoading, setIsLoading, interactions, clearState } = useAutopsy();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    clearState();
    const result = await createAutopsyScenario({});
    if (result.success && result.data) {
      setScenario(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Syringe /> New Case
            </CardTitle>
            <CardDescription>Generate a new autopsy scenario to begin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate New Scenario'
              )}
            </Button>
          </CardContent>
        </Card>

        {scenario && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Stethoscope /> Autopsy Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2"><Dna /> Scenario Details</div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{scenario.scenario}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2"><BrainCircuit /> Cause of Death</div>
                  </AccordionTrigger>
                  <AccordionContent>{scenario.causeOfDeath}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2"><Hourglass /> Time of Death</div>
                  </AccordionTrigger>
                  <AccordionContent>{scenario.timeOfDeath}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2"><Microscope /> Injuries Sustained</div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{scenario.injuriesSustained}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {interactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Analysis Score</CardTitle>
              <CardDescription>Metrics based on your interactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-sm">Organs Examined:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {interactions.map(interaction => (
                  <li key={interaction.name} className="flex justify-between">
                    <span>{interaction.name}</span>
                    <span>{interaction.count}x</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
