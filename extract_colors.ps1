Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("e:\Desktop\Tarand Website\logo.png")
$width = $img.Width
$height = $img.Height
$colors = @{}

for($x=0; $x -lt $width; $x+=10) {
    for($y=0; $y -lt $height; $y+=10) {
        $p = $img.GetPixel($x, $y)
        if($p.A -gt 200) { 
            $key = "#{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
            if($colors.ContainsKey($key)) { $colors[$key]++ } else { $colors[$key] = 1 }
        }
    }
}
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5
