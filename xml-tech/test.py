import lxml.etree as ET

xml_doc = ET.parse("data.xml")
xslt_doc = ET.parse("transform.xslt")
xsd_doc = ET.parse("data.xsd")

schema = ET.XMLSchema(xsd_doc)
if schema.validate(xml_doc):
    print("Validation Successful: Input file format is correct.")
else:
    print("Validation Failed:", schema.error_log)
    exit()

# 3. Transform
transform = ET.XSLT(xslt_doc)
new_dom = transform(xml_doc)

# 4. Save the Result to a NEW file (Original is untouched)
with open("grouped_output.xml", "wb") as f:
    f.write(ET.tostring(new_dom, pretty_print=True, encoding="utf-8"))

print("Success! Created 'grouped_output.xml'")