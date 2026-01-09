package com.tools.utility.source;

import com.tools.utility.env.ConfigManager;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.EntityResolver;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.*;

/**
 * <pre>
 * AutoCodeGenerator
 * </pre>
 *
 * @since 2024. 5. 20
 * @version 1.0
 * @author 이경태
 *
 */
public class AutoCodeGenerator {
    private List<Document> xmls = new ArrayList<>();
    private Document config = null;
    private String encoding = ConfigManager.getProperty("giens.Framework.Automation.Gen.File.Encoding");
    static class NullResolver implements EntityResolver{
        public InputSource resolveEntity(String publicId, String systemId) throws SAXException, IOException{
            return new InputSource(new StringReader(""));
        }
    }
    static class Utils{
        public String documentToString(Document doc) throws Exception {
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(doc), new StreamResult(writer));
            return writer.getBuffer().toString();
        }
        /*
        *  Read XML as DOM
        * */
        public Document readXml(InputStream is) throws SAXException, IOException, ParserConfigurationException {
            DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
            builderFactory.setValidating(false);
            builderFactory.setIgnoringComments(false);
            builderFactory.setIgnoringElementContentWhitespace(true);

            DocumentBuilder documentBuilder = null;
            documentBuilder = builderFactory.newDocumentBuilder();
            documentBuilder.setEntityResolver(new NullResolver());

            return documentBuilder.parse(is);
        }
    }
    public AutoCodeGenerator(){

    }
    public void setConfig(File f) throws Exception{
        FileInputStream fis = new FileInputStream(f);
        Utils util = new Utils();
        this.config = util.readXml(fis);
    }
    public void setXmls(File[] f) throws Exception{
        for(int i = 0; i< f.length; i++){
            FileInputStream fis = new FileInputStream(f[i]);
            Utils util = new Utils();
            this.xmls.add(util.readXml(fis));
        }
    }
    public void setXmls(String[] fileNames) throws Exception{
        Utils util = new Utils();
        for (int i = 0; i < fileNames.length; i++) {
//            System.out.println("setXmls : " + i);
            File file = new File(fileNames[i]);
            if(!file.exists()){
                throw new Exception(fileNames[i] + ": File not found");
            }
            if (file.length() == 0) {
                throw new Exception(fileNames[i] + ": isEmpty Documents");
            }
            try (FileInputStream fis = new FileInputStream(file)) {
                Document doc = util.readXml(fis);
                this.xmls.add(doc);
//                // XML 내용을 문자열로 변환하여 출력
//                String xmlContent = util.documentToString(doc);
//                System.out.println("XML Content of " + fileNames[i] + ":\n" + xmlContent);

            } catch (Exception e) {
                throw new Exception("Error processing file: " + fileNames[i], e);
            }
        }
    }
    public String replaceFirstCharUpper(String str){
        if((null == str) || (str.isEmpty())) return str;
        String rStr = str.substring(0,1);
        rStr = rStr.toUpperCase();
        rStr += str.substring(1);
        return rStr;
    }
    private String replaceReservedChar(String fullstr, String name, String str) {
        String rtnStr = fullstr;
        rtnStr = rtnStr.replaceAll("#" + name + "#", str);
        rtnStr = rtnStr.replaceAll("#" + name.toUpperCase() + "#", str.toUpperCase());
        rtnStr = rtnStr.replaceAll("#" + replaceFirstCharUpper(name) + "#", replaceFirstCharUpper(str));
        return rtnStr;
    }
    private boolean isNullable(String val){
        val = val.toUpperCase();
        return val.equals("Y") || val.equals("YES") || val.equals("TRUE") || val.equals("1");
    }
    private boolean isNullNotable(String val){
        val = val.toUpperCase();
        return val.equals("N") || val.equals("NO") || val.equals("FALSE") || val.equals("0");
    }
    public void generateCodeString() throws Exception {
        if (null == this.config) throw new Exception("Configuration file Could not Setting");
        if (null == this.xmls) throw new Exception("Source Template XML file Could not Setting");
        int xml_cnt = this.xmls.size();

        for (int index_xml = 0; index_xml < xml_cnt; index_xml++) {
            String conjunction = this.xmls.get(index_xml).getElementsByTagName("conjunction").item(0).getTextContent();
            String ext = this.xmls.get(index_xml).getElementsByTagName("ext").item(0).getTextContent();
            String path = this.xmls.get(index_xml).getElementsByTagName("path").item(0).getTextContent();
            String sourcetype = this.xmls.get(index_xml).getElementsByTagName("sourcetype").item(0).getTextContent();
            String filename = this.xmls.get(index_xml).getElementsByTagName("filename").item(0).getTextContent();
            String genunit = null;
            System.out.println("filename:"+filename);
            System.out.println("sourcetype:"+sourcetype);
            System.out.println("path:"+path);
            try {
//                genunit = this.xmls.get(index_xml).getElementsByTagName("gen-unit").item(0).getTextContent();
            } catch (Exception e) {
                throw new Exception(e);
            }

            NodeList entities = this.config.getElementsByTagName("entity");
            if ("entity".equals(genunit)) {
                String mergeSource = "";

                for (int index_entity = 0; index_entity < entities.getLength(); index_entity++) {
                    String source = this.xmls.get(index_xml).getElementsByTagName("source").item(0).getTextContent().trim();
                    Node entity = entities.item(index_entity);
                    String bulid = entity.getAttributes().getNamedItem("build").getNodeValue();

                    if (!"yes".equals(bulid.toLowerCase())) continue;

                    String entity_name = entity.getAttributes().getNamedItem("name").getNodeValue();
                    String entity_desc = entity.getAttributes().getNamedItem("desc").getNodeValue();
                    String service = entity.getAttributes().getNamedItem("service").getNodeValue();
                    String namespace = entity.getAttributes().getNamedItem("namespace").getNodeValue();
                    String scope = entity.getAttributes().getNamedItem("scope").getNodeValue();
                    String tablename = entity.getAttributes().getNamedItem("tablename").getNodeValue();

                    source = source.replaceAll("#entity_name#", entity_name);
                    source = source.replaceAll("#entity_desc#", entity_desc);
                    source = source.replaceAll("#service#", service);
                    source = source.replaceAll("#sourcetype#", sourcetype);
                    source = source.replaceAll("#tablename#", tablename);

                    source = source.replaceAll("#ENTITY_NAME#", entity_name.toUpperCase());
                    source = source.replaceAll("#ENTITY_DESC#", entity_desc.toUpperCase());
                    source = source.replaceAll("#SERVICE#", service.toUpperCase());
                    source = source.replaceAll("#SOURCETYPE#", sourcetype.toUpperCase());
                    source = source.replaceAll("#TABLENAME#", tablename.toUpperCase());

                    source = source.replaceAll("#Entity_name#", replaceFirstCharUpper(entity_name));
                    source = source.replaceAll("#Entity_desc#", replaceFirstCharUpper(entity_desc));
                    source = source.replaceAll("#Service#", replaceFirstCharUpper(service));
                    source = source.replaceAll("#Sourcetype#", replaceFirstCharUpper(sourcetype));
                    source = source.replaceAll("#Tablename#", replaceFirstCharUpper(tablename));

                    int cnt = this.xmls.get(index_xml).getElementsByTagName("definition").item(0).getChildNodes().getLength();
                    for (int j = 0; j < cnt; j++) {
                        if (Node.ELEMENT_NODE == this.xmls.get(index_xml).getElementsByTagName("definition").item(0).getChildNodes().item(j).getNodeType()) {
                            String nodename = this.xmls.get(index_xml).getElementsByTagName("definition").item(0).getChildNodes().item(j).getNodeName();
                            String value = this.xmls.get(index_xml).getElementsByTagName(nodename).item(0).getTextContent();

                            source = replaceReservedChar(source, nodename, value);

                            source = replaceReservedChar(source, "entity_name", entity_name);
                            source = replaceReservedChar(source, "entity_desc", entity_desc);
                            source = replaceReservedChar(source, "service", service);
                            source = replaceReservedChar(source, "sourcetype", sourcetype);
                            source = replaceReservedChar(source, "namespace", namespace);
                            source = replaceReservedChar(source, "scope", scope);
                        }
                    }
                    mergeSource = mergeSource + source + "\n";
                }

                try{
                    String fileName = filename;
                    String paTh = path;
                    File dir = new File(paTh);
                    if(!dir.exists()) dir.mkdirs();

                    PrintWriter out = new PrintWriter(new OutputStreamWriter(new FileOutputStream(paTh + fileName + "." + ext), encoding));

                    out.write(mergeSource);
                    out.close();
                }catch(IOException e){
                    throw new Exception(e);
                }
            }else{
                for(int index_entity = 0; index_entity < entities.getLength(); index_entity++){
                    String source = this.xmls.get(index_xml).getElementsByTagName("source").item(0).getTextContent().trim();

                    Node entity = entities.item(index_entity);

                    String build = entity.getAttributes().getNamedItem("build").getNodeValue();

                    if(!"yes".equals(build.toLowerCase())) continue;

                    String entity_name = entity.getAttributes().getNamedItem("name").getNodeValue();
                    String entity_desc = entity.getAttributes().getNamedItem("desc").getNodeValue();
                    String service = entity.getAttributes().getNamedItem("service").getNodeValue();
                    String namespace = entity.getAttributes().getNamedItem("namespace").getNodeValue();
                    String scope = entity.getAttributes().getNamedItem("scope").getNodeValue();
                    String tablename = entity.getAttributes().getNamedItem("tablename").getNodeValue();

                    source = source.replaceAll("#entity_name#", entity_name);
                    source = source.replaceAll("#entity_desc#", entity_desc);
                    source = source.replaceAll("#service#", service);
                    source = source.replaceAll("#sourcetype#", sourcetype);
                    source = source.replaceAll("#tablename#", tablename);

                    source = source.replaceAll("#ENTITY_NAME#", entity_name.toUpperCase());
                    source = source.replaceAll("#ENTITY_DESC#", entity_desc.toUpperCase());
                    source = source.replaceAll("#SERVICE#", service.toUpperCase());
                    source = source.replaceAll("#SOURCETYPE#", sourcetype.toUpperCase());
                    source = source.replaceAll("#TABLENAME#", tablename.toUpperCase());

                    source = source.replaceAll("#Entity_name#", replaceFirstCharUpper(entity_name));
                    source = source.replaceAll("#Entity_desc#", replaceFirstCharUpper(entity_desc));
                    source = source.replaceAll("#Service#", replaceFirstCharUpper(service));
                    source = source.replaceAll("#Sourcetype#", replaceFirstCharUpper(sourcetype));
                    source = source.replaceAll("#Tablename#", replaceFirstCharUpper(tablename));
                    while(source.indexOf("#begin#") > 0){
                        int begin = source.indexOf("#begin#");
                        int end = source.indexOf("#end#");

                        String loopstr = source.substring(begin + "#begin#".length(),end);
                        List<String> entity_keyfields = new ArrayList<>();
                        List<String> entity_nullfields = new ArrayList<>();
                        List<String> entity_notkeyfilednotnullfields = new ArrayList<>();
                        List<String> entity_notkeyfields = new ArrayList<>();
                        List<Map<String,String>> entity_fields = new ArrayList<>();

                        NodeList fields = entity.getChildNodes();
                        for(int k = 0; k < fields.getLength(); k++){
                            if(Node.ELEMENT_NODE == fields.item(k).getNodeType()){
                                Node field = fields.item(k);

                                if("true".equals(field.getAttributes().getNamedItem("keyfield").getNodeValue())){
                                    entity_keyfields.add(field.getAttributes().getNamedItem("name").getNodeValue());
                                }
                                if("false".equals(field.getAttributes().getNamedItem("keyfield").getNodeValue())){
                                    entity_notkeyfields.add(field.getAttributes().getNamedItem("name").getNodeValue());
                                }
                                if(isNullNotable(field.getAttributes().getNamedItem("nullable").getNodeValue())){
                                    entity_nullfields.add(field.getAttributes().getNamedItem("name").getNodeValue());
                                }
                                if(isNullable(field.getAttributes().getNamedItem("nullable").getNodeValue())){
                                    entity_notkeyfilednotnullfields.add(field.getAttributes().getNamedItem("name").getNodeValue());
                                }

                                String nullable = field.getAttributes().getNamedItem("nullable").getNodeValue();
                                String flag = nullable.equals("Y")||nullable.equals("YES") ?  "false" : "true";

                                String notnull = field.getAttributes().getNamedItem("nullable").getNodeValue();
                                String notnullFlag = nullable.equals("Y")|nullable.equals("YES") ?  "true" : "false";

                                String paramtype = field.getAttributes().getNamedItem("type").getNodeValue();

                                String typeofparam = "String";
                                if(paramtype.equalsIgnoreCase("NUMBER")){
                                    typeofparam = "Integer";
                                }else if(paramtype.equalsIgnoreCase("DATE") || paramtype.equalsIgnoreCase("DATETIME")){
                                    typeofparam = "Date";
                                }
                                Map<String, String> map = new HashMap<>();
                                map.put("name",field.getAttributes().getNamedItem("name").getNodeValue());
                                map.put("desc",field.getAttributes().getNamedItem("desc").getNodeValue());
                                map.put("type",field.getAttributes().getNamedItem("type").getNodeValue());
                                map.put("length",field.getAttributes().getNamedItem("length").getNodeValue());
                                map.put("nullable",flag);
                                map.put("notnull",notnullFlag);
                                map.put("typeofparam",typeofparam);

                                entity_fields.add(map);
                            }
                        }
                        if(loopstr.indexOf("#Key_fields#") > 0){
                            int keyField_cnt = entity_keyfields.size();
                            String rts = "";
                            for(int s = 0; s < keyField_cnt; s++){
                                if(s < keyField_cnt -1){
                                    rts += loopstr.replaceAll("#Key_fields#", replaceFirstCharUpper(entity_keyfields.get(s)).toLowerCase()).replaceAll("#conjunction#" , conjunction);
                                }else{
                                    rts += loopstr.replaceAll("#Key_fields#", replaceFirstCharUpper(entity_keyfields.get(s)).toLowerCase()).replaceAll("#conjunction#" , "");
                                }
                            }
                            StringBuffer stringBuffer = new StringBuffer();

                            String front = source.substring(0,begin);
                            String back = source.substring(end + "#end#".length());

                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#key_fields#") > 0){

                            int keyField_cnt = entity_keyfields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0; s < keyField_cnt; s++){
                                if( s < keyField_cnt - 1){
                                    rts += loopstr.replaceAll("#key_fields#", entity_keyfields.get(s).toLowerCase())
                                                  .replaceAll("#KEY_FIELDS#", entity_keyfields.get(s).toUpperCase())
                                                  .replaceAll("#conjunction#",conjunction)
                                                  .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                  .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                  .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                  .replaceAll("#and#", "")
                                                  .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                  .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                }else{
                                    rts += loopstr.replaceAll("#key_fields#", entity_keyfields.get(s).toLowerCase())
                                                  .replaceAll("#KEY_FIELDS#", entity_keyfields.get(s).toUpperCase())
                                                  .replaceAll("#conjunction#","")
                                                  .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                  .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                  .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                  .replaceAll("#and#", "AND")
                                                  .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                  .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                }
                            }

                            StringBuffer stringBuffer = new StringBuffer();
                            String front = source.substring(0, begin);
                            String back = source.substring(end + "#end#".length());
                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#field_name#") > 0){
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0 ; s < field_cnt; s++){
                                if(s < field_cnt -1 ){
                                    rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                            .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                            .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                            .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                            .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                            .replaceAll("#conjunction#",conjunction)
                                            .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                            .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                            .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                            .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                }else{
                                    rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                            .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                            .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                            .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                            .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                            .replaceAll("#conjunction#", "")
                                            .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                            .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                            .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                            .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                }
                            }
                            StringBuffer stringBuffer = new StringBuffer();

                            String front  = source.substring(0, begin);
                            String back  = source.substring(end + "#end#".length());
                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#Field_name#") > 0){
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0; s < field_cnt; s++){
                                if( s < field_cnt - 1){
                                    rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                            .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                            .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                            .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                            .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                            .replaceAll("#conjunction#", conjunction)
                                            .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                            .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                            .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                            .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                } else {
                                    rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                            .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                            .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                            .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                            .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                            .replaceAll("#conjunction#", "")
                                            .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                            .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                            .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                            .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                }
                                StringBuffer stringBuffer = new StringBuffer();
                                String front = source.substring(0, begin);
                                String back = source.substring(end + "#end#".length());

                                stringBuffer.append(front);
                                stringBuffer.append(rts);
                                stringBuffer.append(back);

                                source = stringBuffer.toString();
                            }
                        }else if(loopstr.indexOf("#notKeyFieldInFieldName#") > 0){
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0; s < field_cnt; s++){
                                if(!entity_nullfields.contains(entity_fields.get(s).get("name")) && !entity_keyfields.contains(entity_fields.get(s).get("name"))
                                ){
                                    if(s < field_cnt - 1){
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#conjunction#", conjunction)
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }else{
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#conjunction#", "")
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }
                                }
                            }
                            StringBuffer stringBuffer = new StringBuffer();
                            String front = source.substring(0, begin);
                            String back = source.substring(end + "#end#".length());

                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#notkey_fields#") > 0){
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0; s < field_cnt; s++){
                                if(entity_notkeyfields.contains(entity_fields.get(s).get("name"))){
                                    if(s < field_cnt - 1){
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#conjunction#", conjunction)
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }else{
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#conjunction#", "")
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }
                                }
                            }
                            StringBuffer stringBuffer = new StringBuffer();
                            String front = source.substring(0, begin);
                            String back = source.substring(end + "#end#".length());

                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#fieldNotNullAndNotKey#") > 0){
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0; s < field_cnt; s++){
                                if(!entity_notkeyfilednotnullfields.contains(entity_fields.get(s).get("name"))){
                                    if(s < field_cnt - 1){
                                        if(s == 0){
                                            rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                    .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                    .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                    .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                    .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#conjunction#", "")
                                                    .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                    .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                    .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                    .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        }else{
                                            rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                    .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                    .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                    .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                    .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                    .replaceAll("#conjunction#", conjunction)
                                                    .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                    .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                    .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                    .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        }
                                        increaseNumber++;
                                    }else{
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#notkey_fields#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#fieldNotNullAndNotKey#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#notKeyFieldInFieldName#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#conjunction#", "123122")
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }
                                }
                            }
                            StringBuffer stringBuffer = new StringBuffer();
                            String front = source.substring(0, begin);
                            String back = source.substring(end + "#end#".length());

                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#FIELD_NAME#") > 0) {
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for (int s = 0; s < field_cnt; s++) {
                                if (s < field_cnt - 1) {
                                    rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                            .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                            .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                            .replaceAll("#conjunction#", conjunction)
                                            .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                            .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                            .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                            .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                } else {
                                    rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                            .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                            .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                            .replaceAll("#conjunction#", "")
                                            .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                            .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                            .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                            .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                    increaseNumber++;
                                }
                            }
                                StringBuffer stringBuffer = new StringBuffer();
                                String front = source.substring(0, begin);
                                String back = source.substring(end + "#end#".length());

                                stringBuffer.append(front);
                                stringBuffer.append(rts);
                                stringBuffer.append(back);

                                source = stringBuffer.toString();
                        }else if(loopstr.indexOf("#notnull_field_name#") > 0){
                            int field_cnt = entity_fields.size();
                            String rts = "";
                            int increaseNumber = 0;
                            for(int s = 0 ; s < field_cnt; s++){
                                if(s < field_cnt -1 ){
                                    if(entity_fields.get(s).get("nullable").equals("true")){
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#conjunction#",conjunction)
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#notnull_field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#NOTNULL_FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }
                                }else{
                                    if(entity_fields.get(s).get("nullable").equals("true")){
                                        rts += loopstr.replaceAll("#length#", replaceFirstCharUpper(entity_fields.get(s).get("length")))
                                                .replaceAll("#Field_name#", replaceFirstCharUpper(entity_fields.get(s).get("name")))
                                                .replaceAll("#field_desc#", entity_fields.get(s).get("desc"))
                                                .replaceAll("#field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#conjunction#", "")
                                                .replaceAll("#increase_no#", Integer.toString(increaseNumber))
                                                .replaceAll("#typeofparam#", entity_fields.get(s).get("typeofparam"))
                                                .replaceAll("#notnull_field_name#", entity_fields.get(s).get("name").toLowerCase())
                                                .replaceAll("#NOTNULL_FIELD_NAME#", entity_fields.get(s).get("name").toUpperCase())
                                                .replaceAll("#nullable#", entity_fields.get(s).get("nullable"))
                                                .replaceAll("#notnull#", entity_fields.get(s).get("notnull"));
                                        increaseNumber++;
                                    }
                                }
                            }
                            StringBuffer stringBuffer = new StringBuffer();

                            String front  = source.substring(0, begin);
                            String back  = source.substring(end + "#end#".length());
                            stringBuffer.append(front);
                            stringBuffer.append(rts);
                            stringBuffer.append(back);

                            source = stringBuffer.toString();
                        }
                    }
                    // definition replace
                    int cnt = this.xmls.get(index_xml).getElementsByTagName("definition").item(0).getChildNodes().getLength();
                    for (int j = 0; j < cnt; j++) {
                        if (Node.ELEMENT_NODE == this.xmls.get(index_xml).getElementsByTagName("definition").item(0).getChildNodes().item(j).getNodeType()) {
                            String nodename = this.xmls.get(index_xml).getElementsByTagName("definition").item(0).getChildNodes().item(j).getNodeName();
                            String value = this.xmls.get(index_xml).getElementsByTagName(nodename).item(0).getTextContent();
                            source = replaceReservedChar(source, nodename, value);

                            source = replaceReservedChar(source, "entity_name", entity_name);
                            source = replaceReservedChar(source, "entity_desc", entity_desc);
                            source = replaceReservedChar(source, "service", service);
                            source = replaceReservedChar(source, "sourcetype", sourcetype);
                            source = replaceReservedChar(source, "namespace", namespace);
                            source = replaceReservedChar(source, "scope", scope);
                        }
                    }
                    try {
                        String fileName = filename;
                        String paTh = path;
                        fileName = replaceReservedChar(fileName, "entity_name", entity_name);
                        fileName = replaceReservedChar(fileName, "entity_desc", entity_desc);
                        fileName = replaceReservedChar(fileName, "service", service);
                        fileName = replaceReservedChar(fileName, "sourcetype", sourcetype);
                        fileName = replaceReservedChar(fileName, "namespace", namespace);
                        fileName = replaceReservedChar(fileName, "scope", scope);

                        paTh = replaceReservedChar(paTh, "entity_name", entity_name);
                        paTh = replaceReservedChar(paTh, "entity_desc", entity_desc);
                        paTh = replaceReservedChar(paTh, "service", service);
                        paTh = replaceReservedChar(paTh, "sourcetype", sourcetype);
                        paTh = replaceReservedChar(paTh, "namespace", namespace);
                        paTh = replaceReservedChar(paTh, "scope", scope);

                        File dir = new File(paTh);
                        if (!dir.exists()) dir.mkdirs();

                        PrintWriter out = new PrintWriter(new OutputStreamWriter(new FileOutputStream(paTh + fileName + "." + ext), encoding));

                        out.write(source);
                        out.close();
                    } catch (IOException e) {
                        throw new Exception(e);
                    }
                }
            }
        }
    }

    public static void main(String args[]) throws Exception{
        System.out.println("================= START GENERATING =================");
        AutoCodeGenerator acg = new AutoCodeGenerator();

        int cnt = 0;
        String fileName = null;
        cnt = Integer.parseInt(Objects.requireNonNull(ConfigManager.getProperty("giens.Framework.Automation.Gen.Template.Xml.Files.Count")));
        String fileLists[] = new String[cnt];
//        System.out.println("Parsing file Count : " + cnt);
        for(int i = 0; i < cnt; i++){
            fileName = ConfigManager.getProperty("giens.Framework.Automation.Gen.Template.Xml.Files." + i);
            System.out.println("parsing..");
            if(null == fileName) break;
            if(!new File(fileName).isFile()) break;

//            System.out.println("Parsing Counting : " + i);
            fileLists[i] = fileName;
        }
        acg.setConfig(new File(Objects.requireNonNull(ConfigManager.getProperty("giens.Framework.Automation.Gen.Entity.Xml.File"))));
        Arrays.stream(fileLists).forEach(e -> System.out.println(e));
        acg.setXmls(fileLists);
        System.out.println("gigi");
        acg.generateCodeString();
        System.out.println("gigi222");
        System.out.println("================= END GENERATING =================");

    }
}
