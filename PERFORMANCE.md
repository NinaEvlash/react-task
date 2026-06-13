## Before optimization

### Sorting

### Sort by name

- Commit duration: 8 s
- Render duration: 432.1 ms
- Observation: The majority of rendering time is spent in CountryList, which re-renders after sorting the list of countries.

### Screenshot:

**Flame Graph:**  
![](public/image-1.png)  
**Ranked Chart:**  
![](public/image-2.png)

### Sort by population

- Commit duration: 4.4 s
- Render duration: 506.5 ms
- Observation: Sorting by population causes a significant re-render of the CountryList component. The majority of rendering time is spent rendering the list of countries, which indicates that the entire list is being recalculated and re-rendered on each sort.

### Screenshot:

**Flame Graph:**  
![](public/image-3.png)  
**Ranked Chart:**  
![](public/image-4.png)

### Search country

- Commit duration: 22 s
- Render duration: 40.5 ms
- Observation: Searching does not significantly affect CountryList rendering. However, YearSelector takes most of the rendering time during the interaction, which indicates unnecessary re-rendering of this component on search input changes.

### Screenshot:

**Flame Graph:**  
![](public/image-5.png)  
**Ranked Chart:**  
![](public/image-6.png)

### Change year

- Commit duration: 4 s
- Render duration: 34.9 ms
- Observation: Changing the year causes a full re-render of YearSelector, which is the main performance bottleneck in this interaction. Other components like CountryList are not significantly affected.

### Screenshot:

**Flame Graph:**  
![](public/image-7.png)  
**Ranked Chart:**  
![](public/image-8.png)

### Toggle columns

- Commit duration: 1.8 s
- Render duration: 51.1 ms
- Observation: Toggling columns causes an unnecessary re-render of YearSelector, which remains the main performance bottleneck across multiple interactions. CountryList is not significantly affected.

### Screenshot:

**Flame Graph:**  
![](public/image-9.png)  
**Ranked Chart:**  
![](public/image-10.png)
