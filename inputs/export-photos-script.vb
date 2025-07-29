' Original source: https://www.reddit.com/r/excel/comments/1723zka/comment/k3udv1k/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

' ## Run this script
' * Open Excel Desktop (doesn't work in web version)
' * Load Excel, click Developer, Visual basic - this will bring the vb window up. or use the shortcut Alt + F11
' * Click tools/references and scroll down the list looking for Microsoft Scripting Runtime - if box not ticked please tick it, click ok and close vb window.

Sub ExportImages_ExtendOffice()
    Dim xStrPath As String
    Dim xStrImgName As String
    Dim xImg As Shape
    Dim xObjChar As ChartObject
    Dim xFD As FileDialog
    Set xFD = Application.FileDialog(msoFileDialogFolderPicker)
    xFD.Title = "Please select a folder to save the pictures" & " - ExtendOffice"
    If xFD.Show = -1 Then
       xStrPath = xFD.SelectedItems.Item(1) & "\"
    Else
        Exit Sub
    End If
    
    On Error Resume Next
    For Each xImg In ActiveSheet.Shapes
        If xImg.TopLeftCell.Column = 1 Then
        xStrImgName = xImg.TopLeftCell.Offset(0, 3).Value
        If xStrImgName <> "" Then
            xImg.Select
            
            Selection.Copy
            Set xObjChar = ActiveSheet.ChartObjects.Add(0, 0, xImg.Width, xImg.Height)
            With xObjChar
                .Border.LineStyle = xlLineStyleNone
                .Activate
                ActiveChart.Paste
                .Chart.Export xStrPath & xStrImgName & ".png"
                .Delete
            End With
        End If
        End If
    Next
End Sub
