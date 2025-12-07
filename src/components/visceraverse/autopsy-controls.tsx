'use client';

import { createAutopsyScenario } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useAutopsyStore } from './autopsy-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Dna, Hourglass, Loader2, Microscope, Stethoscope, Syringe, ZoomIn, FileText } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import React from 'react';

export default function AutopsyControls() {
  const { scenario, setScenario, isLoading, setIsLoading, interactions, clearState, activeTool, setActiveTool, discoveredEvidence } = useAutopsyStore();
  const { toast } = useToast();

  const handleLoadScenario = React.useCallback(async () => {
    setIsLoading(true);
    clearState();
    const result = await createAutopsyScenario();
    if (result.success && result.data) {
      const scenarioData = {
        ...result.data,
        evidence: result.data.evidence || [],
      };
      setScenario(scenarioData);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  }, [setIsLoading, clearState, setScenario, toast]);

  React.useEffect(() => {
    handleLoadScenario();
  }, [handleLoadScenario]);

  const tools = [
    { name: 'magnifying-glass', icon: ZoomIn, label: 'Magnifying Glass' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {isLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading Case...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {scenario && !isLoading && (
          <>
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

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <ZoomIn /> Forensic Tools
                </CardTitle>
                <CardDescription>Select a tool to interact with the model.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                {tools.map(tool => (
                   <Button 
                    key={tool.name}
                    variant={activeTool === tool.name ? 'secondary' : 'outline'}
                    className="flex flex-col h-20 gap-2"
                    onClick={() => setActiveTool(activeTool === tool.name ? null : tool.name)}
                   >
                     <tool.icon className="h-6 w-6"/>
                     <span className="text-xs">{tool.label}</span>
                   </Button>
                ))}
              </CardContent>
            </Card>

            {discoveredEvidence.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <FileText /> Evidence Log
                  </CardTitle>
                  <CardDescription>Findings from your examination.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {discoveredEvidence.map(evidenceId => {
                    const evidence = scenario.evidence.find(e => e.id === evidenceId);
                    if (!evidence) return null;
                    return (
                      <div key={evidence.id} className="text-sm p-3 bg-muted rounded-md">
                        <p className="font-semibold">{evidence.data.title}</p>
                        <p className="text-muted-foreground">{evidence.description}</p>
                      </div>
                    )
                  })}
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
          </>
        )}
      </div>
    </ScrollArea>
  );
}
