'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon } from 'lucide-react'

export function PictureBox() {
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const fd = localStorage.getItem("formData");
      if (fd) {

        // const parsedData = JSON.parse(fd);
        // parsedData.common_data.profile_picture = "dwight";
        try {
          const parsedData = JSON.parse(fd);
  
          // Ensure common_data exists
          if (!parsedData.common_data) {
            parsedData.common_data = {};
          }
  
          // Save the file name
          parsedData.common_data.profile_picture = file.name;
  
          // Save updated data back to localStorage
          localStorage.setItem("formData", JSON.stringify(parsedData));
        } catch (error) {
          console.error("Error parsing formData from localStorage:", error);
        }
      }

    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }
 

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="aspect-square w-full relative bg-muted rounded-md overflow-hidden">
          {image ? (
            <Image
              src={image || "/placeholder.svg"}
              alt="Attached picture"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Input
          id="profile_pic"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button onClick={handleAttachClick} className="w-full hidden">
          Attach Picture
        </Button>
      </CardFooter>
    </Card>
  )
}

