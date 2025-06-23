"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ExternalLink, FileIcon, X, Type, Hash, Image, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditRecordFormProps {
  columns: any[];
  initialData?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  columnProps?: Record<string, any>;
}

export function AppTableDialogForm({ columns, initialData, onSubmit, onCancel, columnProps }: EditRecordFormProps) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors }, getValues, trigger } = useForm({
      defaultValues: initialData || {},
      mode: 'onChange'
    });
    
    const [inputTypes, setInputTypes] = useState<Record<string, string>>({});
  
    useEffect(() => {
      const types: Record<string, string> = {};
      const defaultVals = initialData ? JSON.parse(JSON.stringify(initialData)) : {};
  
      columns.forEach(column => {
          if (column.id !== 'actions' && column.id !== 'select') {
              const value = defaultVals[column.accessorKey];
              let determinedType = 'text';
  
              if (column.dataType) {
                  determinedType = column.dataType;
              } else if (column.filterOptions && column.filterOptions.length > 0) {
                  determinedType = 'select';
              } else if (value !== null && value !== undefined) {
                  if (typeof value === 'number') {
                      determinedType = 'number';
                  } else if (value instanceof Date) {
                      determinedType = 'datetime';
                  } else if (typeof value === 'string') {
                      if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) && !isNaN(Date.parse(value))) {
                          determinedType = 'datetime';
                      }
                  }
              }
              types[column.id] = determinedType;
  
              if (determinedType === 'datetime') {
                const formatForInput = (d: Date) => {
                    const year = d.getFullYear();
                    const month = (`0${d.getMonth() + 1}`).slice(-2);
                    const day = (`0${d.getDate()}`).slice(-2);
                    const hours = (`0${d.getHours()}`).slice(-2);
                    const minutes = (`0${d.getMinutes()}`).slice(-2);
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                }

                if (value) { // has initial value
                    try {
                        const d = new Date(value);
                        if(!isNaN(d.getTime())) {
                            defaultVals[column.accessorKey] = formatForInput(d);
                        }
                    } catch (e) {
                        console.error("Invalid date:", value);
                    }
                } else if (!initialData) { // new record, no initial value
                    defaultVals[column.accessorKey] = formatForInput(new Date());
                }
            }
          }
      });
  
      setInputTypes(types);
      reset(defaultVals);
    }, [columns, initialData, reset]);

    useEffect(() => {
      const subscription = watch((value, { name }) => {
          if (!name) return;
          const column = columns.find(c => c.accessorKey === name);
          if (column && column.validationTrigger) {
              const triggers = Array.isArray(column.validationTrigger) ? column.validationTrigger : [column.validationTrigger];
              triggers.forEach((fieldName: string) => trigger(fieldName));
          }
      });
      return () => subscription.unsubscribe();
    }, [watch, trigger, columns]);
  
    const formValues = watch();
  
    const handleTypeChange = (columnId: string, type: string) => {
      const currentValue = getValues(columnId);
      setInputTypes(prev => ({ ...prev, [columnId]: type }));
      
      if (type === 'datetime') {
        setValue(columnId, '');
      } else if (type === 'number') {
        setValue(columnId, 0);
      } else if (type === 'file') {
        setValue(columnId, '');
      } else if (type === 'select') {
        const options = columns.find(col => col.id === columnId)?.filterOptions || [];
        if (options.length > 0) {
          setValue(columnId, options[0]);
        } else {
          setValue(columnId, '');
        }
      } else {
        setValue(columnId, currentValue ? String(currentValue) : '');
      }
    };
  
    const isValidUrl = (string: string): boolean => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };

    const isImageUrl = (url: string): boolean => {
      return isValidUrl(url) && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    };
  
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'text':
          return <Type className="h-4 w-4" />;
        case 'number':
          return <Hash className="h-4 w-4" />;
        case 'file':
          return <Image className="h-4 w-4" />;
        case 'datetime':
          return <CalendarIcon className="h-4 w-4" />;
        case 'select':
          return <ListFilter className="h-4 w-4" />;
        default:
          return <Type className="h-4 w-4" />;
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {columns
            .filter(column => column.id !== 'actions' && column.id !== 'select')
            .map((column) => {
              const currentType = inputTypes[column.id] || 'text';
              const validationRules = typeof column.validation === 'function'
                ? column.validation(getValues)
                : column.validation;
              
              return (
                <div key={column.id} className="space-y-2">
                  <Label htmlFor={column.id} className="text-sm font-medium">
                    {column.header}
                  </Label>
                  
                  <div className="grid gap-2">
                    {currentType === 'text' && (
                      <div className="relative w-full">
                        <Input
                          id={column.id}
                          {...register(column.accessorKey, validationRules)}
                          className={cn(
                            "pr-9",
                            errors[column.accessorKey] ? "border-destructive" : ""
                          )}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            >
                              {getTypeIcon(currentType)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                              <Type className="mr-2 h-4 w-4" /> Text
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                              <Hash className="mr-2 h-4 w-4" /> Number
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                              <Image className="mr-2 h-4 w-4" /> File URL
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                              <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                            </DropdownMenuItem>
                            {column.filterOptions && (
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                <ListFilter className="mr-2 h-4 w-4" /> Select
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                        
                    {currentType === 'number' && (
                      <div className="relative w-full">
                        <Input
                          id={column.id}
                          type="number"
                          {...register(column.accessorKey, { 
                            ...validationRules,
                            valueAsNumber: true 
                          })}
                          className={cn(
                            "pr-9",
                            errors[column.accessorKey] ? "border-destructive" : ""
                          )}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              >
                                {getTypeIcon(currentType)}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                                <Type className="mr-2 h-4 w-4" /> Text
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                                <Hash className="mr-2 h-4 w-4" /> Number
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                                <Image className="mr-2 h-4 w-4" /> File URL
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                                <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                              </DropdownMenuItem>
                              {column.filterOptions && (
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                  <ListFilter className="mr-2 h-4 w-4" /> Select
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                    )}
                        
                    {currentType === 'file' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              id={column.id}
                              placeholder="Enter URL"
                              {...register(column.accessorKey, { 
                                ...validationRules,
                                validate: {
                                  ...(validationRules?.validate || {}),
                                  validUrl: value => !value || isValidUrl(value) || "Please enter a valid URL"
                                }
                              })}
                              className={cn(
                                "pr-9",
                                errors[column.accessorKey] ? "border-destructive" : ""
                              )}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                >
                                  {getTypeIcon(currentType)}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                                  <Type className="mr-2 h-4 w-4" /> Text
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                                  <Hash className="mr-2 h-4 w-4" /> Number
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                                  <Image className="mr-2 h-4 w-4" /> File URL
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                                  <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                                </DropdownMenuItem>
                                {column.filterOptions && (
                                  <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                    <ListFilter className="mr-2 h-4 w-4" /> Select
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {formValues[column.accessorKey] && isValidUrl(formValues[column.accessorKey]) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(formValues[column.accessorKey], '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {formValues[column.accessorKey] && isValidUrl(formValues[column.accessorKey]) && (
                          <div className="relative rounded-md border overflow-hidden">
                            {isImageUrl(formValues[column.accessorKey]) ? (
                              <img 
                                src={formValues[column.accessorKey]} 
                                alt="Preview"
                                className="w-full h-24 object-cover"
                              />
                            ) : (
                              <div className="w-full h-24 bg-muted/30 flex items-center justify-center">
                                <FileIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80"
                              onClick={() => setValue(column.accessorKey, '')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {currentType === 'datetime' && (
                      <div className="relative">
                        <Input
                          id={column.id}
                          type="datetime-local"
                          {...register(column.accessorKey, {
                            ...validationRules,
                            valueAsDate: true,
                          })}
                          className={cn(
                            "pr-9",
                            errors[column.accessorKey] ? "border-destructive" : ""
                          )}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            >
                              {getTypeIcon(currentType)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                              <Type className="mr-2 h-4 w-4" /> Text
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                              <Hash className="mr-2 h-4 w-4" /> Number
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                              <Image className="mr-2 h-4 w-4" /> File URL
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                              <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                            </DropdownMenuItem>
                            {column.filterOptions && (
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                <ListFilter className="mr-2 h-4 w-4" /> Select
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    
                    {currentType === 'select' && column.filterOptions && (
                      <div className="relative">
                        <Select
                          value={formValues[column.accessorKey] || ''}
                          onValueChange={(value) => setValue(column.accessorKey, value)}
                        >
                          <SelectTrigger className={cn(
                            "pr-9",
                            errors[column.accessorKey] ? "border-destructive" : ""
                          )}>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {column.filterOptions.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            >
                              {getTypeIcon(currentType)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                              <Type className="mr-2 h-4 w-4" /> Text
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                              <Hash className="mr-2 h-4 w-4" /> Number
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                              <Image className="mr-2 h-4 w-4" /> File URL
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                              <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                            </DropdownMenuItem>
                            {column.filterOptions && (
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                <ListFilter className="mr-2 h-4 w-4" /> Select
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                    
                  {errors[column.accessorKey] && (
                    <p className="text-xs text-destructive">
                      {errors[column.accessorKey]?.message as string || "This field has an error."}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Add'} Record
          </Button>
        </DialogFooter>
      </form>
    );
}